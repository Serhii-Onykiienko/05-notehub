import { useState } from "react";
import toast from "react-hot-toast";
import css from "./App.module.css";

import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { fetchNotes, deleteNote, createNote } from "../../services/noteService";

import type { CreateNoteParams } from "../../services/noteService";

import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", query, page],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: query,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },

    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      setPage(1);
      setModal(false);
    },

    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreateNote = (values: CreateNoteParams) => {
    createMutation.mutate(values);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setModal(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>Something went wrong. Please try again.</p>}

      {!isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDelete} />
      )}

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <NoteForm
            onCancel={() => setModal(false)}
            onSubmit={handleCreateNote}
            isSubmitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
