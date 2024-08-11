import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.mode.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {

    const { userName, fullName, email, password } = req.body
    if (!userName || !fullName || !email || !password) {
        throw new apiError(400, "Fill the all fileds")
    }

    // if (
    //     [userName, email, fullName, password].some((filed) => filed?.trim() === "")
    // ) {
    //     throw new apiError(400, "All Filed are Required")
    // }

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new apiError(400, "User Already Exists")
    }

    const avatarImageLocalPath = req.files?.avatarImage[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarImageLocalPath) {
        throw new apiError(400, "Avatar Is Mandatory")
    }

    const avatarImage = await uploadOnCloudinary(avatarImageLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarImage) {
        throw new apiError(400, "Avatar file not uploaded")
    }
    const user = await User.create({
        fullName,
        avatarImage: avatarImage.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while creating a new user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully")
    )
})


export { registerUser }