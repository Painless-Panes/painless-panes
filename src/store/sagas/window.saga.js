import axios from "axios";
import { put, select, takeLatest } from "redux-saga/effects";
import { setAllWindows, setCurrentWindowId } from "../reducers/window.reducer";

// action types
export const GET_ALL_WINDOWS = "GET_ALL_WINDOWS";
export const ADD_WINDOW = "ADD_WINDOW";
export const UPDATE_WINDOW_DIMENSIONS = "UPDATE_WINDOW_DIMENSIONS";
export const ADD_WINDOW_PHOTO = "ADD_WINDOW_PHOTO";

// action functions
export const getAllWindows = (payload) => {
  return { type: GET_ALL_WINDOWS, payload };
};

export const addWindow = (payload) => {
  return { type: ADD_WINDOW, payload };
};

export const updateWindowDimensions = (payload) => {
  return { type: UPDATE_WINDOW_DIMENSIONS, payload };
};

export const addWindowPhoto = (payload) => {
  return { type: ADD_WINDOW_PHOTO, payload };
};

// action worker sagas
export function* getAllWindowsSaga(action) {
  const project_id = action.payload.project_id;
  console.log("Getting all windows for project:", project_id);
  try {
    const response = yield axios.get(`/api/window/${project_id}`);
    const windows = yield response.data;
    console.log("Received window list:", windows);
    yield put(setAllWindows(windows));

    // If the currentWindowId is null, set it to the last window in he list
    const currentWindowId = yield select((store) => store.currentWindowId);
    if (currentWindowId === null) {
      const lastWindowId = Math.max(windows.map((window) => window.id));
      yield put(setCurrentWindowId(lastWindowId));
    }
  } catch (error) {
    console.error(error);
  }
}

export function* addWindowSaga(action) {
  const project_id = action.payload.get("project_id");
  try {
    const windowIdResponse = yield axios.post(
      `/api/window/${project_id}`,
      project_id
    );
    // id of the created window
    const windowId = yield windowIdResponse.data;
    yield put(setCurrentWindowId(windowId));
    e;
  } catch (error) {
    console.error(error);
  }
}

// generator function to POST an image to AWS S3, then PUT
// an update to the current window, updating the image column
// with the AWS suffix
export function* addWindowPhotoSaga(action) {
  try {
    // folder/file of the bucket the image is stored in
    const windowPathResponse = yield axios.post(
      `/api/window/photoUpload/aws`,
      // payload is the formData object from AddImage
      action.payload
    );
    // handles the updating of the image
    const currentWindowId = yield select((store) => store.currentWindowId);
    yield axios.put(`/api/window/${currentWindowId}/image`, windowPathResponse);
  } catch (error) {
    console.error(error);
  }
}

export function* updateWindowDimensionsSaga(action) {
  const { projectId, width, height } = action.payload;
  try {
    const response = yield axios.put(`/api/window/${projectId}`, {
      width,
      height,
    });
    console.log("Updated window dimensions:", response.data);
  } catch (error) {
    console.error("Failed to update window dimensions:", error);
  }
}

export function* updateWindowImage(action) {
  const windowId = action.payload.id;
  try {
    const response = yield axios.put(
      `/api/window/image/${windowId}`, action.payload
    );
    const windowImage = response.data
    yield put (setCurrentWindowId(windowImage))
  }
  catch (error) {
    console.error(error);
  }
};


// watcher saga
export function* windowSaga() {
  yield takeLatest(GET_ALL_WINDOWS, getAllWindowsSaga);
  yield takeLatest(ADD_WINDOW, addWindowSaga);
  yield takeLatest(UPDATE_WINDOW_DIMENSIONS, updateWindowDimensions);
  yield takeLatest(ADD_WINDOW_PHOTO, addWindowPhotoSaga);
}
