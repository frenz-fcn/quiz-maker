import axios from 'axios';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import type { Quiz } from '../types';

export const transformQuiz = (data: Quiz): Quiz => ({
  ...data,
  createdAt: dayjs(data.createdAt).format('MMM DD, YYYY'),
});

const useQuizListDataQuery = () => {
  return useQuery({
    queryKey: ['QUIZ_LIST'],
    queryFn: () => axios.get<Quiz[]>('/quizzes'),
    select: ({ data }) => data.map(transformQuiz),
  });
};

export default useQuizListDataQuery;
