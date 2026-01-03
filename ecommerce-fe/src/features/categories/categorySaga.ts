import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import categoriesService from "./categoryService";
import {
  categoriesFailure,
  createCategoryRequest,
  createCategorySuccess,
  deleteCategoryRequest,
  deleteCategorySuccess,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  updateCategoryRequest,
  updateCategorySuccess,
} from "./categorySlice";

function* fetchCategorySaga(): SagaIterator {
  try {
    const response = yield call(categoriesService.getAll);
    yield put(fetchCategoriesSuccess(response.data));
  } catch (error) {
    yield put(categoriesFailure("Failed to fetch products"));
  }
}

function* createCategorySaga(action: any): SagaIterator {
  try {
    const response = yield call(categoriesService.create, action.payload);
    yield put(createCategorySuccess(response.data));
    yield put(fetchCategoriesRequest());
  } catch (err) {
    yield put(categoriesFailure("Failed to create product"));
  }
}

function* updateCategorySaga(action: any): SagaIterator {
  try {
    const response = yield call(categoriesService.update, action.payload);
    yield put(updateCategorySuccess(response.data));
    yield put(fetchCategoriesRequest());
  } catch (error) {
    yield put(categoriesFailure("Failed to update product"));
  }
}
function* deleteCategorySaga(action: any): SagaIterator {
  try {
    const id = action.payload.id;
    const response = yield call(categoriesService.delete, id);
    yield put(deleteCategorySuccess(response.message));
    yield put(fetchCategoriesRequest());
  } catch (error) {
    yield put(categoriesFailure("Failed to delete product"));
  }
}

export default function* productSaga() {
  yield takeLatest(fetchCategoriesRequest.type, fetchCategorySaga);
  yield takeLatest(createCategoryRequest.type, createCategorySaga);
  yield takeLatest(updateCategoryRequest.type, updateCategorySaga);
  yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
}
