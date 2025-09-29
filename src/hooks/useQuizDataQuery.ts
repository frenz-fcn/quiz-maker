import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import type { Quiz } from '../types';
import { transformQuiz } from './useQuizListDataQuery';

const useQuizDataQuery = (quizId?: number) => {
  return useQuery({
    queryKey: ['QUIZ', quizId],
    queryFn: () => axios.get<Quiz>(`/quizzes/${String(quizId)}`),
    enabled: !!quizId,
    select: ({ data }) => transformQuiz(data),
  });
};

export default useQuizDataQuery;
