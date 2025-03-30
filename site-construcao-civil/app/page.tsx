'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ImageCarousel from './components/ImageCarousel';
import Modal from './components/Modal';

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
}

export default function Home() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    fetchProjetos();
  }, []);

  async function fetchProjetos() {
    try {
      // Buscar projetos
      const { data: projetosData, error: projetosError } = await supabase
        .from('projetos')
        .select('*')
        .order('id', { ascending: false });

      if (projetosError) throw projetosError;

      // Buscar imagens para cada projeto
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
      setError('Erro ao carregar os projetos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Imagem de fundo com efeito parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[2s] hover:scale-100"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
          }}
        >
          {/* Overlay gradiente mais suave */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Conteúdo */}
        <div className="container mx-auto px-4 relative text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center animate-fade-in">
            Construção Civil de Qualidade
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-center text-gray-200 animate-fade-in-up">
            Transformando ideias em realidade com excelência e profissionalismo
          </p>
          <div className="flex justify-center animate-fade-in-up">
            <a
              href="#projetos"
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-full font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto cursor-pointer"
            >
              Ver Nossos Projetos
            </a>
          </div>
        </div>

        {/* Gradiente de transição */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent" 
          style={{ 
            background: 'linear-gradient(to top, white, rgba(255, 255, 255, 0.9) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 75%, transparent)'
          }}
        />
      </section>

      {/* Projetos Section */}
      <section id="projetos" className="relative py-12 sm:py-16 bg-white">
        {/* Gradiente superior */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/70 to-transparent pointer-events-none"
          style={{ 
            background: 'linear-gradient(to bottom, white, rgba(255, 255, 255, 0.9) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.1) 75%, transparent)'
          }}
        />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Projetos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça alguns dos nossos trabalhos mais recentes e veja como transformamos espaços em obras de arte.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              {error}
            </div>
          ) : projetos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum projeto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {projetos.map((projeto) => (
                <div
                  key={projeto.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <ImageCarousel
                      images={projeto.imagens.map(img => img.url)}
                      title={projeto.titulo}
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        {projeto.categoria}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                      {projeto.titulo}
                    </h3>
                    <button 
                      onClick={() => setSelectedProjeto(projeto)}
                      className="w-full sm:w-auto text-yellow-600 font-medium hover:text-yellow-700 transition-colors flex items-center justify-center group cursor-pointer"
                    >
                      Ver mais detalhes
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sobre Nós Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sobre Nós
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Com anos de experiência no mercado, nossa equipe é especializada em entregar projetos de alta qualidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12">
            <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">10+</div>
              <div className="text-gray-600 text-base sm:text-lg">Anos de Experiência</div>
            </div>
            <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">50+</div>
              <div className="text-gray-600 text-base sm:text-lg">Projetos Concluídos</div>
            </div>
            <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">100+</div>
              <div className="text-gray-600 text-base sm:text-lg">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Entre em Contato
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Tem um projeto em mente? Entre em contato conosco para discutir como podemos ajudar a transformar sua visão em realidade.
            </p>
            <a
              href="https://wa.me/5551995114411?text=Olá! Tenho interesse nos seus serviços. Gostaria de mais informações."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.287.129.332.202.045.073.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
              </svg>
              Fale Conosco no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        isOpen={!!selectedProjeto}
        onClose={() => {
          setSelectedProjeto(null);
          setShowImages(false);
        }}
        title={selectedProjeto?.titulo || ''}
        description={selectedProjeto?.descricao || ''}
        images={selectedProjeto?.imagens.map(img => img.url) || []}
        onViewImages={() => setShowImages(true)}
      />

      {/* Grid de Imagens */}
      {showImages && selectedProjeto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          {/* Header fixo */}
          <div className="min-h-[64px] bg-black flex justify-end items-center px-4 border-b border-white/10">
            <button
              onClick={() => setShowImages(false)}
              className="text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Grid de imagens com scroll */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProjeto.imagens.map((imagem, index) => (
                  <div key={index} className="relative aspect-square group cursor-pointer">
                    <img
                      src={imagem.url}
                      alt={`Imagem ${index + 1} do projeto ${selectedProjeto.titulo}`}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 