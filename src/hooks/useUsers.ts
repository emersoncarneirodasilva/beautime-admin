"use client";

import { useEffect, useState } from "react";
import fetchUsers from "@/libs/api/fetchUsers";
import { UserType } from "@/types";

export function useUsers(token: string) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / limit);

  async function load() {
    setLoading(true);

    const data = await fetchUsers({ token, page, limit, search });

    setUsers(data.users.filter((u: UserType) => u.role === "USER"));
    setTotal(data.total);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [page, search]);

  return {
    users,
    page,
    totalPages,
    search,
    loading,
    setPage,
    setSearch,
  };
}
