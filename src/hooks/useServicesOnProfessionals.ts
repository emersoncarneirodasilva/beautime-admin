"use client";

import { useEffect, useState, useCallback } from "react";
import fetchServicesOnProfessionals from "@/libs/api/fetchServicesOnProfessionals";
import { ServiceProfessional } from "@/types";

export function useServicesOnProfessionals(token: string) {
  const [items, setItems] = useState<ServiceProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchServicesOnProfessionals({
        token,
        page,
        limit,
        search,
      });

      setItems(data.servicesOnProfessional ?? []);
      setTotalPages(Math.ceil(data.total / limit));
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
    loading,
    page,
    search,
    totalPages,
    setPage,
    setSearch,
  };
}
