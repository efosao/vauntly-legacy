import { UserIcon } from "@heroicons/react/solid";
import Link from "next/link";

import useSession from "../hooks/useSession";

export default function Component() {
  const { user } = useSession();

  if (user) {
    return (
      <>
        <Link href="/profile">
          <a className="bg-white p-2 rounded-full border-2 border-gray-500">
            <UserIcon
              className="flex-shrink-0 h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
          </a>
        </Link>
        <span className="mx-4">{user.email}</span>
      </>
    );
  }
  return (
    <>
      <Link className="button" href="/signin">
        Sign in
      </Link>
    </>
  );
}
