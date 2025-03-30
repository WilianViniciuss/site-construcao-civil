'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ImageUpload from '../components/ImageUpload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  imagens: ImagemProjeto[];
}

interface ImagemProjeto {
  id: number;
  url: string;
  ordem: number;
  projeto_id: number;
}

export default function AdminPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    fetchProjetos();
  }, []);

  async function fetchProjetos() {
    try {
      const { data: projetosData, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .order('id', { ascending: false });

      if (projetosError) throw projetosError;

      const projetosComImagens = await Promise.all(
        projetosData.map(async (projeto) => {
          const { data: imagensData, error: imagensError } = await supabase
            .from('imagens_projeto')
            .select('*')
            .eq('projeto_id', projeto.id)
            .order('ordem', { ascending: true });

          if (imagensError) throw imagensError;

          return {
            ...projeto,
            imagens: imagensData || [],
          };
        })
      );

      setProjetos(projetosComImagens);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar os projetos.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (editingProjeto) {
        // Atualizar projeto existente
        const { error: updateError } = await supabase
          .from('projetos')
          .update({
            titulo,
            descricao,
            categoria,
          })
          .eq('id', editingProjeto.id);

        if (updateError) throw updateError;

        // Adicionar novas imagens
        if (uploadedImages.length > 0) {
          const novasImagens = uploadedImages.map((url, index) => ({
            url,
            ordem: editingProjeto.imagens.length + index + 1,
            projeto_id: editingProjeto.id,
          }));

          const { error: imagensError } = await supabase
            .from('imagens_projeto')
            .insert(novasImagens);

          if (imagensError) throw imagensError;
        }

        setMessage({ type: 'success', text: 'Projeto atualizado com sucesso!' });
      } else {
        // Criar novo projeto
        const { data: novoProjeto, error: projetoError } = await supabase
          .from('projetos')
          .insert({
            titulo,
            descricao,
            categoria,
          })
          .select()
          .single();

        if (projetoError) throw projetoError;

        // Inserir imagens
        if (novoProjeto && uploadedImages.length > 0) {
          const imagens = uploadedImages.map((url, index) => ({
            url,
            ordem: index + 1,
            projeto_id: novoProjeto.id,
          }));

          const { error: imagensError } = await supabase
            .from('imagens_projeto')
            .insert(imagens);

          if (imagensError) throw imagensError;
        }

        setMessage({ type: 'success', text: 'Projeto criado com sucesso!' });
      }

      // Limpar formulário
      setTitulo('');
      setDescricao('');
      setCategoria('');
      setUploadedImages([]);
      setEditingProjeto(null);
      setResetKey(prev => prev + 1);
      
      // Atualizar lista de projetos
      await fetchProjetos();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar o projeto.' });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(projeto: Projeto) {
    setEditingProjeto(projeto);
    setTitulo(projeto.titulo);
    setDescricao(projeto.descricao);
    setCategoria(projeto.categoria);
    setUploadedImages([]);
    setResetKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteImage(projetoId: number, imagemId: number) {
    try {
      const { error } = await supabase
        .from('imagens_projeto')
        .delete()
        .eq('id', imagemId);

      if (error) throw error;

      await fetchProjetos();
      setMessage({ type: 'success', text: 'Imagem removida com sucesso!' });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      setMessage({ type: 'error', text: 'Erro ao remover a imagem.' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {editingProjeto ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
          </h1>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagens
              </label>
              <ImageUpload
                onUploadComplete={(urls) => setUploadedImages(urls)}
                initialImages={[]}
                resetKey={resetKey}
              />
            </div>

            <div className="flex justify-end space-x-4">
              {editingProjeto && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjeto(null);
                    setTitulo('');
                    setDescricao('');
                    setCategoria('');
                    setUploadedImages([]);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar Edição
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-md hover:from-yellow-600 hover:to-yellow-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Salvando...' : editingProjeto ? 'Atualizar Projeto' : 'Adicionar Projeto'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projetos Existentes</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            </div>
          ) : projetos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum projeto cadastrado.</p>
          ) : (
            <div className="space-y-8">
              {projetos.map((projeto) => (
                <div key={projeto.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{projeto.titulo}</h3>
                      <p className="text-sm text-gray-500">{projeto.categoria}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(projeto)}
                      className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{projeto.descricao}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projeto.imagens.map((imagem) => (
                      <div key={imagem.id} className="relative group">
                        <img
                          src={imagem.url}
                          alt={`Imagem ${imagem.ordem} do projeto ${projeto.titulo}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleDeleteImage(projeto.id, imagem.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 