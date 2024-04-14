import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma, { blogSelect } from 'lib/prisma';
import AppNavbar from 'layouts/AppNavbar';
import Container from 'components/base/Container';
import { fetcher } from 'lib/utils';
import { useEffect } from 'react';
import absoluteUrl from 'next-absolute-url';
import { PrimaryButton } from 'components/base/Button';

export default function MyBlogs({ blogs, protocol, host, session }) {
  const router = useRouter();

  const removeBlog = async (id: any) => {
    await fetcher('/api/delete-blog', {
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    router.reload();
  };

  useEffect(() => {
    if (!session?.user) {
      router.push('/');
    }
  }, [session?.user]);

  return (
    <div className="h-screen bg-gray-50">
      <AppNavbar />
      <Container small>
        <div className="mt-12 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="text-xl font-semibold text-gray-900">My blog</div>
            <div className="mt-2 text-sm text-gray-700">
              List of your blogs. You can create a new blog or edit an existing one.
            </div>
          </div>
          <Link passHref href="/add-blog">
            <PrimaryButton>New blog</PrimaryButton>
          </Link>
        </div>
        <div className="mt-8 overflow-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Blogfolio domain
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Custom domain
                </th>

                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map(directory => (
                <Link key={directory.id} passHref href={`/edit-blog/${directory.slug}`}>
                  <tr key={directory.email} className="cursor-pointer hover:bg-gray-50">
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {directory.slug}.{host}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {directory.customDomain}
                    </td>

                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                      <span
                        className="mr-8 text-red-600 hover:text-red-800"
                        onClick={e => {
                          if (confirm('Are you sure to remove this blog?')) {
                            removeBlog(directory.id);
                          }
                          e.preventDefault();
                        }}
                      >
                        Remove
                      </span>

                      <span
                        className="text-blue-600 hover:text-blue-900"
                        onClick={e => {
                          e.preventDefault();
                          window.open(`${protocol}//${directory.slug}.${host}`, '_blank');
                        }}
                      >
                        Visit
                      </span>
                    </td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const { protocol, host } = absoluteUrl(context.req);

  const blogs = await prisma.blogWebsite.findMany({
    where: { email: session?.user.email },
    select: { ...blogSelect, id: true }
  });

  return {
    props: {
      session,
      blogs,
      protocol,
      host
    }
  };
}
