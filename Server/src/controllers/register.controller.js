import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
// Generate access and refresh token
// Access token for authorization of user to access protected resources .Refresh token to obtain new access token
const generateAcessAndRefreshTokens = async (_id) => {
  // userId is returned by the user object created below
  try {
    console.log("Generating token", _id);
    const user = await User.findById(_id);
    console.log("found");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, userID, password } = req.body;
  console.log(req.body);

  if ([email, userID, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields required");
  }

  const existedUser = await User.findOne({
    $or: [{ userID }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userID already exists");
  }

  // Create user object
  const user = await User.create({
    userID: userID.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { userID, password } = req.body;

  if (!userID || !password) {
    throw new ApiError(400, "UserID and password required");
  }

  const user = await User.findOne({ userID });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logging out user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

// Refresh token generating the access Token again and again
const refreshAccessToken = asyncHandler(async (req, res) => {
  const inrefreshToken = req.cookies.refreshToken || req.body.refreshToken; //inrefresh token which is coming after hitting an end point
  if (!inrefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      inrefreshToken,
      process.env.REFRESJ_TOKEN_SECRET
    );
    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh token");
    }
    if (inrefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateAcessAndRefreshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("RefreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
