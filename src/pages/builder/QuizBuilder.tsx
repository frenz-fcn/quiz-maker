import { HiArrowLeft, HiEye, HiPlus } from 'react-icons/hi';

import { Button, Table, Text, Badge } from '../../components';
import { useQuizListDataQuery, useCreateQuizModal } from '../../hooks';
import { useNavigate } from 'react-router-dom';

const QuizBuilder = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuizListDataQuery();
  const openCreateQuizModal = useCreateQuizModal();

  return (
    <div className="flex flex-col h-screen p-mds-24">
      <div>
        <Button
          size="sm"
          variant="ghost"
          intent="primary"
          onClick={() => navigate('/')}
          leadingIcon={HiArrowLeft}
        >
          Go back
        </Button>
      </div>
      <div className="flex justify-between my-4 items-center">
        <Text size="lead" weight="bold">
          Create Quiz
        </Text>
        <Button
          leadingIcon={HiPlus}
          intent="primary"
          onClick={openCreateQuizModal}
        >
          Create
        </Button>
      </div>
      <div className="flex-grow h-0 flex flex-col flex-1">
        <Table data={data ?? []} isLoading={isLoading}>
          {({ Column }) => (
            <>
              <Column label="ID" name="id" />
              <Column label="Title" name="title" />
              <Column label="Description" name="description" />
              <Column label="Time Limit Seconds" name="timeLimitSeconds" />
              <Column
                label="Is Published"
                name="isPublished"
                render={({ isPublished }) => (
                  <Badge
                    intent={isPublished ? 'info' : 'default'}
                    label={isPublished ? 'Published' : 'Not Published'}
                  />
                )}
              />
              <Column label="Created At" name="createdAt" />
              <Column
                label=""
                name="id"
                render={(row) => (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      icon={HiEye}
                      type="button"
                      variant="icon"
                      intent="default"
                      onClick={() => openCreateQuizModal(row)}
                    />
                  </div>
                )}
              />
            </>
          )}
        </Table>
      </div>
    </div>
  );
};

export default QuizBuilder;
