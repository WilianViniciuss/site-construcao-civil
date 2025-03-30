'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  imagem_url: string;
  categoria: string;
}

export default function Home() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjetos() {
      try {
        console.log('Iniciando busca de projetos...');
        const { data, error } = await supabase
          .from('projetos')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.error('Erro ao buscar projetos:', error);
          setError(error.message);
          throw error;
        }

        console.log('Projetos encontrados:', data);
        setProjetos(data || []);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        setError('Erro ao carregar os projetos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchProjetos();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Nossos Trabalhos</h1>
            <p className="text-xl">Excelência em Construção Civil</p>
          </motion.div>
        </div>
      </section>

      {/* Projetos Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Projetos</h2>
          
          {error && (
            <div className="text-center text-red-500 mb-8">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center">Carregando projetos...</div>
          ) : projetos.length === 0 ? (
            <div className="text-center">Nenhum projeto encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projetos.map((projeto: Projeto) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={projeto.imagem_url}
                    alt={projeto.titulo}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', projeto.imagem_url);
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem+não+disponível';
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{projeto.titulo}</h3>
                    <p className="text-gray-600 mb-4">{projeto.descricao}</p>
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {projeto.categoria}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sobre Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Sobre Nós</h2>
            <p className="text-gray-600 mb-8">
              Com anos de experiência no mercado, nossa equipe se destaca pela qualidade
              e compromisso com cada projeto. Utilizamos as melhores práticas e
              tecnologias para entregar resultados excepcionais.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
} 