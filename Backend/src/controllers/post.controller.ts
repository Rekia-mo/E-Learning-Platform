// post.controller.ts
import { Request, Response } from "express";
import { Post, User,PostLike,PostComment } from "../models/index";
import { z, ZodError } from "zod";

// Interface pour récupérer les infos de l'utilisateur depuis le token
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ================================ Schémas Zod ===============================
// Schéma pour créer un post
const createPostSchema = z.object({
  title: z
    .string()
    .max(255, "the title must be at most 255 characters")
    .min(1, "the title is required    "),
  content: z.string().min(1, "the content is required"),
});

// Schéma pour mettre à jour un post (seulement titre et contenu)
const updatePostSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().optional(),
});

// Type pour un post incluant le nom de l'auteur
interface PostWithUser extends Post {
  User?: { name: string; isSick: boolean };
}

// ================================ GET ALL POSTS =============================

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Récupération de l'ID de l'utilisateur connecté depuis le token
    const user_id = req.user!.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no user ID in token",
      });
    }

    // ✅ Récupération des informations complètes de l'utilisateur pour vérifier isSick
    const currentUser = await User.findByPk(user_id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Récupération de tous les posts avec les infos de l'auteur
    let posts = (await Post.findAll({
      include: [{ model: User, attributes: ["name", "isSick"] }],
      order: [["createdAt", "DESC"]],
    })) as PostWithUser[];

    // ✅ Filtrage selon isSick
    posts = posts.filter((post) => post.User?.isSick === currentUser.isSick);

    // ======= CHECK IF USER LIKED POSTS =========
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const like = await PostLike.findOne({
          where: {
            post_id: post.id,
            user_id: user_id,
          },
        });

        return {

          ...post.toJSON(),
          isLikedByCurrentUser: !!like,
          commentsCount: await PostComment.count({
          where: { post_id: post.id },
      }), // true if user already liked the post


        };
      })
    );

    // ========= RETURN ALL POSTS ========
    return res.status(200).json({
      success: true,
      count: postsWithLikes.length, // nombre total de posts
      data: postsWithLikes, // toutes les données
    });

  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ GET MY POSTS =============================
// Récupérer uniquement les posts de l'utilisateur connecté
export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.user!.id;

    const posts = (await Post.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    })) as PostWithUser[];

    return res.status(200).json({
      success: true,
      count: posts.length, // nombre total de posts
      data: posts, // toutes les données
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
// ================================ CREATE POST(POST) ==============================
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    // validation du body avec Zod
    const body = createPostSchema.parse(req.body);

    const user_id = req.user!.id;

    // récupérer l'utilisateur pour vérifier isSick
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // si l'utilisateur est malade → post spécialisé
    const isSpecialized = user.isSick ? true : false;

    // création du post
    const post = await Post.create({
      ...body,
      user_id,
      isSpecialized,
    });

    // retourner seulement les données du post créé
    return res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
// ================================ UPDATE POST(PUT) ==============================
// Mettre à jour un post (seulement titre et contenu) si l'utilisateur est propriétaire
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0]; // sécurité TypeScript

    // Validation du body
    const body = updatePostSchema.parse(req.body);

    // Récupérer le post et son auteur
    const post = (await Post.findByPk(id, {
      include: [{ model: User, attributes: ["name"] }],
    })) as PostWithUser;

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // Vérification de propriété : seul le propriétaire peut modifier
    const user_id = req.user!.id;

    if (post.user_id !== user_id)
      return res.status(403).json({
        success: false,
        message: "User is not authorized to update this post",
      });

    // Mise à jour des champs autorisés uniquement
    await post.update({
      title: body.title ?? post.title,
      content: body.content ?? post.content,
    });

    //  retourner le post mis à jour
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ DELETE POST(DELETE) ==============================
// Supprimer un post si l'utilisateur est propriétaire
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0]; // sécurité TypeScript

    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // Vérification de propriété
    const user_id = req.user!.id;
    if (post.user_id !== user_id)
      return res.status(403).json({
        success: false,
        message: "User is not authorized to delete this post",
      });

    await post.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ DELETE POST BY ADMIN (DELETE) ==============================
// Supprimer un post si l'utilisateur est Admin (sans vérification de propriété)
export const deletePostByAdmin = async (req: AuthRequest, res: Response) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0]; // sécurité TypeScript

    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

// ================================ LIKE POST(PATCH) ==============================
export const likePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const post_id = req.params.id;
    const user_id = (req as any).user.id; // depuis ton middleware JWT

    const post = await Post.findByPk(post_id);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    // Vérifier si l'user a déjà liké
    const existingLike = await PostLike.findOne({ where: { post_id, user_id } });

    if (existingLike) {
      // Déjà liké → unlike
      await existingLike.destroy();
      post.likes -= 1;
    } else {
      // Pas encore liké → like
      await PostLike.create({ post_id, user_id });
      post.likes += 1;
    }

    await post.save();

    return res.status(200).json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ err: err.message });
  }
};