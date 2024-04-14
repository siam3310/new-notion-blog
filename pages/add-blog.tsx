import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import EditForm from '../components/EditForm';
import Container from '../components/base/Container';
import SignIn from 'components/SignIn';
import AppNavbar from 'layouts/AppNavbar';
import { fetcher } from 'lib/utils';

export default function Index() {
  const { data: session } = useSession();
  const { register, handleSubmit, setValue, watch, control, formState } = useForm({
    defaultValues: null
  });
  const router = useRouter();

  if (!session) {
    return <SignIn />;
  }

  const onSubmitForm = async (values: any) => {
    await fetcher('/api/create-blog', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    router.reload();
  };

  const editFormProps = {
    blog: null,
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmitForm,
    control,
    formState
  };

  return (
    <>
      <AppNavbar />
      <div className="py-16 bg-gray-100">
        <Container small>
          <div className="space-y-8 ">
            <EditForm {...editFormProps} />
          </div>
        </Container>
      </div>
    </>
  );
}
