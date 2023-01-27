import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { act } from "react-dom/test-utils";

// 첫 번째 인자 : 이름
// 두 번째 인자 : 비동기함수

// 0. 값 조회
export const __getTodos = createAsyncThunk(
  "GET_TODOS",
  async (arg, thunkAPI) => {
    try {
      const todos = await axios.get("http://localhost:4000/todos");
      console.log("todos", todos.data);
      return thunkAPI.fulfillWithValue(todos.data);
    } catch (error) {}
  }
);

export const __addTodoThunk = createAsyncThunk(
  "ADD_TODO",
  async (arg, thunkAPI) => {
    try {
      await axios.post("http://localhost:4000/todos", arg);
      return thunkAPI.fulfillWithValue(arg);
    } catch (error) {
      console.log(error);
    }
  }
);
export const __deleteTodoThunk = createAsyncThunk(
  "DELETE_TODO",
  async (arg, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${arg}`);
      return thunkAPI.fulfillWithValue(arg);
    } catch (error) {
      return console.log(error);
    }
  }
);
export const __switchTodoThunk = createAsyncThunk(
  "SWITCH_TODO",
  async (arg, thunkAPI) => {
    try {
      axios.patch(`http://localhost:4000/todos/${arg.id}`, arg);
      return thunkAPI.fulfillWithValue(arg);
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// initial states
const initialState = {
  todos: [],
  isSuccess: false,
  isLoading: false,
  error: null,
};

// createSlice의 결과물 -> action creators와 reducers
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // addTodo: (state, action) => {
    //   return [...state, action.payload];
    // }, // action creator의 이름
    removeTodo: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    }, // action creator의 이름
    switchTodo: (state, action) => {
      return state.map((item) => {
        if (item.id === action.payload) {
          return { ...item, isDone: !item.isDone };
        } else {
          return item;
        }
      });
    }, // action creator의 이름
  },
  extraReducers: {
    [__getTodos.fulfilled]: (state, action) => {
      state.todos = action.payload;
    },
    [__addTodoThunk.fulfilled]: (state, action) => {
      state.todos.push(action.payload);
    },
    [__deleteTodoThunk.fulfilled]: (state, action) => {
      state.todos = state.todos.filter((item) => item.id !== action.payload);
    },
    [__switchTodoThunk.fulfilled]: (state, action) => {
      state.todos = state.todos.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, isDone: !item.isDone };
        }

        return item;
      });
    },
  },
});

export const { removeTodo, switchTodo } = todosSlice.actions;
export default todosSlice.reducer;
