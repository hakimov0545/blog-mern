import postModel from "../models/post.model.js";

class PostController {
	async getAll(req, res) {
		try {
			const posts = await postModel
				.find()
				.populate("user")
				.exec();
			res.status(200).json(posts);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not get posts",
			});
		}
	}

	async getById(req, res) {
		try {
			const postId = req.params.id;
			const post = await postModel
				.findByIdAndUpdate(
					{ _id: postId },
					{ $inc: { viewsCount: 1 } },
					{ new: true }
				)
				.populate("user")
				.exec();
			res.status(200).json(post);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not get post",
			});
		}
	}

	async getLastTags(req, res) {
		try {
			const posts = await postModel.find().limit(5).exec();
			const tags = posts
				.map((obj) => obj.tags)
				.flat()
				.slice(0, 5);
			res.status(200).json(tags);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not get post",
			});
		}
	}

	async create(req, res) {
		const { title, text, tags, imageUrl } = req.body;
		try {
			const doc = new postModel({
				title,
				text,
				tags: tags.split(",").map((tag) => tag.trim()),
				imageUrl,
				user: req.userId,
			});
			const post = await doc.save();
			res.status(201).json(post);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not create post",
			});
		}
	}

	async update(req, res) {
		try {
			const postId = req.params.id;
			const post = await postModel.findByIdAndUpdate(
				postId,
				{
					...req.body,
					tags: req.body.tags
						.split(",")
						.map((tag) => tag.trim()),
				},
				{ new: true }
			);
			res.status(200).json(post);
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not update post",
			});
		}
	}

	async delete(req, res) {
		try {
			const postId = req.params.id;
			await postModel.findByIdAndDelete(postId);
			res.status(200).json({ message: "Post deleted" });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Could not delete post",
			});
		}
	}
}

export default new PostController();
