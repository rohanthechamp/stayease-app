import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
export const metadata = {
  title: "Account",

}
const page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>

      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome to account page -  {String(session?.user?.name).split(' ')[2]}
      </h2>
    </div>
  )
}

export default page