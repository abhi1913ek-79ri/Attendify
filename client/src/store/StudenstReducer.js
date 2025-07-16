import { STUDENT_ACTIONS } from './Actions.js';

export const studentReducer = (state, action) => {
  switch (action.type) {
    case STUDENT_ACTIONS.SET_STUDENTS:
      return action.payload;

    case STUDENT_ACTIONS.ADD_STUDENT:
      return [...state, action.payload];

    case STUDENT_ACTIONS.UPDATE_ATTENDANCE:
      return state.map((student) =>
        student.id === action.payload.id
          ? { ...student, attendance: action.payload.attendance }
          : student
      );

    case STUDENT_ACTIONS.DELETE_STUDENT:
      return state.filter((student) => student.id !== action.payload);

    case STUDENT_ACTIONS.RESET:
      return [];

    default:
      return state;
  }
};
