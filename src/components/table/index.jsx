import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getAlunos from "../../requests/aluno";

import { removerAluno } from "../../requests/aluno";
import { toast } from "react-toastify";

import { useState } from "react";
import Modal from "../modal";
import Loading from "../loading";

export default function Table(props) {
  const { setFormData } = props;

  const queryClient = useQueryClient();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState({});

  const { data, isFetching } = useQuery(["@alunos"], getAlunos, {
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading } = useMutation(removerAluno, {
    onSuccess: () => {
      queryClient.invalidateQueries(["@alunos"]);
      toast.success("Apagado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao apagar aluno");
    },
  });

  function renderSkeleton() {
    return (
      <div class="mx-auto mt-12 w-full shadow">
        <div class="flex animate-pulse space-x-4">
          {/* <div class="h-10 w-10 rounded-full bg-slate-700"></div> */}
          <div class="w-full flex-1 space-y-2">
            <div class="h-10 rounded  bg-slate-900"></div>
            <div class="h-10 rounded bg-slate-900"></div>
            <div class="h-10 rounded bg-slate-900"></div>
            <div class="h-10 rounded bg-slate-900"></div>
            <div class="h-10 rounded bg-slate-900"></div>
          </div>
        </div>
      </div>
    );
  }

  function apagarAluno(id) {
    mutate(id);
  }

  function preencherCampos(aluno) {
    setFormData({ ...aluno, id: aluno._id });
  }

  if (isFetching) {
    return renderSkeleton();
  }

  return (
    <div className="font-poppins">
      <h1 className="my-5 text-white">Alunos</h1>

      <table className="min-w-full text-gray-400">
        <thead>
          <tr className="bg-slate-600/40">
            <th className="py-2 text-left font-semibold">Ordem</th>
            <th className="py-2 text-left font-semibold">Nome</th>
            <th className="py-2 text-left font-semibold">Matricula</th>
            <th className="py-2 text-left font-semibold">Curso</th>
            <th className="py-2 text-center font-semibold">Bimestre</th>
            <th className="py-2 text-center font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((aluno, index) => (
            <tr
              key={aluno._id}
              className="border-b border-b-gray-500 font-light"
            >
              <td>{index + 1}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.matricula}</td>
              <td>{aluno.curso}</td>
              <td className="text-center">{aluno.bimestre}</td>
              <td className="flex justify-center gap-2">
                <button
                  onClick={() => preencherCampos(aluno)}
                  className="m-1 rounded-md bg-sucess p-1 text-xs font-normal text-white transition delay-100 ease-out hover:bg-green-950"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setAlunoSelecionado(aluno);
                  }}
                  className="text-whittransition m-1 rounded-md bg-danger p-1 text-xs font-normal text-white delay-100 ease-out hover:bg-red-950"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onAfterClose={() => setAlunoSelecionado({})}
        onRequestClose={() => setIsOpen(false)}
      >
        <div>
          <h1 className="mb-2 font-poppins">Confirmar Exclusão</h1>
          <p className="mb-8 font-poppins font-light">
            Desejar excluir o aluno {alunoSelecionado.nome}?
          </p>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                apagarAluno(alunoSelecionado._id);
                setIsOpen(false);
              }}
              className=" m-1 rounded-md bg-sucess px-4 py-2 font-poppins text-xs font-light text-white transition delay-100 ease-out hover:bg-green-950"
            >
              Sim
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="text-whittransition m-1 rounded-md bg-danger px-4 py-2 font-poppins text-xs font-light text-white delay-100 ease-out hover:bg-red-950"
            >
              Não
            </button>
          </div>
        </div>
      </Modal>
      <Modal isLoading={isLoading}>
        <Loading />
      </Modal>
    </div>
  );
}
