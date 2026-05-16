import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AccountWelcome from '../_components/AccountWelcome';
export const metadata = {
  title: "Account",

}
const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-100 flex items-center justify-center">
      {/* Passing session object as a prop directly to our client shell */}
      <AccountWelcome session={session} />
    </main>
  )
}

export default page