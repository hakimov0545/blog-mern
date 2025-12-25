import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PORT, DB_URL, JWT_SECRET } from "./constants/index.js";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js";

const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
	try {
		const user = await UserModel.findOne({
			email: req.body.email,
		});

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const isValidPass = bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		);

		if (!isValidPass) {
			return res.status(400).json({
				message: "Invalid login or password",
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			JWT_SECRET,
			{ expiresIn: "1d" }
		);

		const { passwordHash, ...userDto } = user._doc;

		res.json({ ...userDto, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Could not log in",
		});
	}
});

app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign(
			{
				_id: user._id,
			},
			JWT_SECRET,
			{ expiresIn: "1d" }
		);

		const { passwordHash, ...userDto } = user._doc;

		res.json({ ...userDto, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Could not register",
		});
	}
});

app.get("/auth/me", (req, res) => {
	try {
	} catch (error) {}
});

const starter = async () => {
	try {
		await mongoose.connect(DB_URL).then(() => {
			console.log("DB connected");
		});
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(`Error connecting with DB: ${error}`);
	}
};

starter();
