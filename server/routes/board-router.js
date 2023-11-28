const express = require("express");
const BoardRouter = express.Router();
const BoardService = require("../services/board-service");
const imageUploader = require("../middlewares/s3-handler");
const asyncHandler = require("../middlewares/async-handler");
const ResponseHandler = require("../middlewares/res-handler");
const JwtMiddleware = require("../middlewares/jwt-handler");

// 특정 카테고리의 게시글 가져오기
BoardRouter.get(
  "/categories/:category",
  asyncHandler(async (req, res) => {
    const category = req.params.category;
    const { currentPage, pageSize } = req.query;
    const boards = await BoardService.getBoardsByCategory(category, currentPage, pageSize);
    ResponseHandler.respondWithSuccess(res, boards);
  })
);

// 특정 board ID의 게시글 가져오기
BoardRouter.get(
  "/:boardId",
  asyncHandler(async (req, res) => {
    const board = await BoardService.getBoardById(req.params.boardId);
    if (!board) {
      return ResponseHandler.respondWithNotfound(res);
    }
    ResponseHandler.respondWithSuccess(res, board);
  })
);

// 모든 게시글 가져오기 (모든 사용자, 모든 게시물)
BoardRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { currentPage, pageSize } = req.query;
    const boards = await BoardService.getAllBoards(currentPage, pageSize);
    ResponseHandler.respondWithSuccess(res, boards);
  })
);

// 본인이 작성한 모든 게시글 가져오기
BoardRouter.get(
  "/mypost",
  JwtMiddleware.checkToken,
  asyncHandler(async (req, res) => {
    const user = req.tokenData._id;
    const { currentPage, pageSize } = req.query;
    const boards = await BoardService.getAllBoardsByUserId(user, currentPage, pageSize);
    ResponseHandler.respondWithSuccess(res, boards);
  })
);


// 새로운 게시글 생성
BoardRouter.post(
  "/",
  imageUploader.array("file"),
  JwtMiddleware.checkToken,
  asyncHandler(async (req, res) => {
    const userId = req.tokenData._id;
    const { category, post, tags } = req.body;
    const imagePaths = req.files.map((file) => file.location);
    const boardData = {
      userId,
      category,
      post,
      image: imagePaths,
      tags,
    };
    const newBoard = await BoardService.createBoard(boardData);
    ResponseHandler.respondWithSuccess(res, newBoard);
  })
);

// 특정 ID의 게시글 수정 (본인만 가능)
BoardRouter.put(
  "/:boardId",
  JwtMiddleware.checkToken,
  imageUploader.array("file"),
  asyncHandler(async (req, res) => {
    const uploadedFiles = req.files || [];
    const imagePaths = uploadedFiles.map((file) => file.location);
    const updatedBoard = await BoardService.updateBoard(
      req.tokenData._id,
      req.params.boardId,
      req.body,
      imagePaths
    );
    ResponseHandler.respondWithSuccess(res, updatedBoard);
  })
);

// 특정 ID의 게시글 삭제
BoardRouter.delete(
  "/:boardId",
  JwtMiddleware.checkToken,
  asyncHandler(async (req, res) => {
    const deletedBoard = await BoardService.deleteBoard(req.params.boardId);
    ResponseHandler.respondWithSuccess(res, deletedBoard);
  })
);

module.exports = BoardRouter;
