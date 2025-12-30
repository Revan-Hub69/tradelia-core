-- Microlearning System Tables
-- Complete system for lessons, categories, progress tracking, and quizzes

-- Categories for organizing lessons
CREATE TABLE lesson_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name for UI
  color TEXT, -- Color theme for category
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table with full content structure
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES lesson_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  
  -- Content structure following Tradelia methodology
  concept TEXT NOT NULL, -- The core concept explanation
  real_example TEXT NOT NULL, -- Real-world example
  common_error TEXT NOT NULL, -- What people usually get wrong
  safety_rule TEXT NOT NULL, -- How to avoid the error
  
  -- Lesson metadata
  duration_minutes INTEGER DEFAULT 5,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  
  -- Prerequisites and blocking logic
  is_prerequisite BOOLEAN DEFAULT false, -- Must be completed before others
  prerequisite_lessons UUID[], -- Array of lesson IDs that must be completed first
  
  -- Status and ordering
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  -- SEO and metadata
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions for each lesson
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'open_ended')) DEFAULT 'multiple_choice',
  
  -- Multiple choice options (JSON array)
  options JSONB, -- [{"text": "Option A", "is_correct": true}, {"text": "Option B", "is_correct": false}]
  
  -- Explanation shown after answering
  explanation TEXT,
  
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Can be null for guest users
  session_id TEXT, -- For guest tracking
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Progress status
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'reviewed')) DEFAULT 'not_started',
  
  -- Completion tracking
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Quiz performance
  quiz_attempts INTEGER DEFAULT 0,
  quiz_score INTEGER, -- Percentage score (0-100)
  quiz_passed BOOLEAN DEFAULT false,
  
  -- Time tracking
  time_spent_seconds INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one progress record per user/session per lesson
  UNIQUE(user_id, lesson_id),
  UNIQUE(session_id, lesson_id)
);

-- Quiz attempt tracking
CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Can be null for guest users
  session_id TEXT, -- For guest tracking
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Attempt data
  answers JSONB NOT NULL, -- {"question_id": "selected_answer", ...}
  score INTEGER NOT NULL, -- Percentage score (0-100)
  passed BOOLEAN NOT NULL,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken_seconds INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_lessons_category ON lessons(category_id);
CREATE INDEX idx_lessons_published ON lessons(is_published);
CREATE INDEX idx_lessons_prerequisite ON lessons(is_prerequisite);
CREATE INDEX idx_quiz_questions_lesson ON quiz_questions(lesson_id);
CREATE INDEX idx_user_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_progress_session ON user_lesson_progress(session_id);
CREATE INDEX idx_user_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX idx_quiz_attempts_lesson ON quiz_attempts(lesson_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lesson_categories_updated_at BEFORE UPDATE ON lesson_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON user_lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE lesson_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read active categories" ON lesson_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active quiz questions" ON quiz_questions FOR SELECT USING (is_active = true);

-- User progress policies
CREATE POLICY "Users can read own progress" ON user_lesson_progress FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('app.session_id', true)
);

CREATE POLICY "Users can insert own progress" ON user_lesson_progress FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id = current_setting('app.session_id', true)
);

CREATE POLICY "Users can update own progress" ON user_lesson_progress FOR UPDATE USING (
  auth.uid() = user_id OR session_id = current_setting('app.session_id', true)
);

-- Quiz attempt policies
CREATE POLICY "Users can read own quiz attempts" ON quiz_attempts FOR SELECT USING (
  auth.uid() = user_id OR session_id = current_setting('app.session_id', true)
);

CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (
  auth.uid() = user_id OR session_id = current_setting('app.session_id', true)
);

-- Insert initial categories
INSERT INTO lesson_categories (name, slug, description, icon, color, sort_order) VALUES
('Concetti Base', 'basics', 'Fondamenti essenziali per capire il mondo crypto', 'brain', 'blue', 1),
('Psicologia del Trading', 'psychology', 'Bias cognitivi e errori emotivi comuni', 'warning', 'orange', 2),
('Analisi di Mercato', 'market-analysis', 'Come leggere dati e indicatori senza farsi ingannare', 'chart', 'green', 3),
('Sicurezza e Truffe', 'security', 'Come riconoscere e evitare le truffe più comuni', 'shield', 'red', 4),
('DeFi e Protocolli', 'defi', 'Finanza decentralizzata spiegata senza hype', 'coins', 'purple', 5);

-- Insert initial lessons
INSERT INTO lessons (
  category_id, 
  title, 
  slug, 
  description,
  concept, 
  real_example, 
  common_error, 
  safety_rule,
  duration_minutes,
  difficulty_level,
  is_prerequisite,
  is_published,
  sort_order
) VALUES 
-- Basics Category
(
  (SELECT id FROM lesson_categories WHERE slug = 'basics'),
  'Cos''è la Volatilità',
  'volatilita-crypto',
  'Capire cosa significa volatilità e perché è importante nei mercati crypto',
  'La volatilità misura quanto oscillano i prezzi in un periodo di tempo. È espressa come percentuale e indica l''incertezza del mercato.',
  'Bitcoin passa da €40.000 a €35.000 in una settimana = -12.5% = alta volatilità. Un conto corrente che oscilla dello 0.1% annuo = bassa volatilità.',
  'Pensare che alta volatilità significhi sempre perdite, o che bassa volatilità sia sempre meglio.',
  'Alta volatilità significa rischio in entrambe le direzioni. Può portare guadagni rapidi ma anche perdite rapide. Investi solo quello che puoi permetterti di perdere.',
  3,
  'beginner',
  true,
  true,
  1
),
(
  (SELECT id FROM lesson_categories WHERE slug = 'basics'),
  'Market Cap vs Prezzo',
  'market-cap-prezzo',
  'Perché il prezzo di una singola moneta non indica il suo potenziale',
  'Il market cap è prezzo × numero totale di monete in circolazione. Indica il valore totale di una criptovaluta.',
  'Moneta A: €1 × 1 miliardo di monete = €1 miliardo market cap. Moneta B: €1000 × 1 milione di monete = €1 miliardo market cap. Stesso valore totale, prezzi diversi.',
  'Comprare monete "economiche" (€0.001) pensando che saliranno più facilmente a €1 rispetto a Bitcoin che sale da €40.000 a €41.000.',
  'Il prezzo unitario non indica il potenziale di crescita. Guarda sempre il market cap per capire la dimensione reale del progetto.',
  4,
  'beginner',
  true,
  true,
  2
),
-- Psychology Category  
(
  (SELECT id FROM lesson_categories WHERE slug = 'psychology'),
  'FOMO e Cicli di Hype',
  'fomo-hype-cicli',
  'Come riconoscere e gestire la paura di perdere opportunità',
  'FOMO (Fear of Missing Out) è la paura di perdere un''opportunità che spinge a decisioni affrettate basate sull''emozione invece che sulla logica.',
  'Tutti parlano di una crypto che sale del 300% in una settimana. Vedi post ovunque, amici che guadagnano, influencer che ne parlano. Ti senti obbligato a comprare subito.',
  'Comprare al picco dell''hype quando "tutti ne parlano" e i prezzi sono già saliti molto.',
  'Quando tutti parlano di qualcosa sui social, spesso è già tardi. L''hype di massa di solito coincide con i picchi di prezzo.',
  5,
  'beginner',
  false,
  true,
  1
),
(
  (SELECT id FROM lesson_categories WHERE slug = 'psychology'),
  'Schema Pump & Dump',
  'pump-dump-schema',
  'Come riconoscere e evitare le manipolazioni di prezzo più comuni',
  'Pump & Dump: gonfiare artificialmente il prezzo (pump) attraverso hype coordinato, per poi vendere tutto (dump) lasciando gli altri con perdite.',
  'Gruppo Telegram con 10.000 membri: "Compriamo tutti XYZ alle 15:00 precise". Il prezzo sale rapidamente, gli organizzatori vendono, il prezzo crolla del 80%.',
  'Partecipare pensando di essere abbastanza veloci da comprare e vendere prima degli altri.',
  'Se qualcuno ti dice esattamente quando comprare e vendere una specifica crypto, è una truffa. I guadagni reali non hanno orari prestabiliti.',
  4,
  'intermediate',
  false,
  true,
  2
);

-- Insert quiz questions for the lessons
INSERT INTO quiz_questions (lesson_id, question, question_type, options, explanation, sort_order) VALUES
-- Volatilità Quiz
(
  (SELECT id FROM lessons WHERE slug = 'volatilita-crypto'),
  'Cosa indica la volatilità di una criptovaluta?',
  'multiple_choice',
  '[
    {"text": "Quanto oscillano i prezzi in un periodo", "is_correct": true},
    {"text": "Il prezzo massimo raggiunto", "is_correct": false},
    {"text": "Il numero di transazioni giornaliere", "is_correct": false},
    {"text": "La sicurezza della blockchain", "is_correct": false}
  ]'::jsonb,
  'La volatilità misura l''ampiezza delle oscillazioni di prezzo, non il prezzo assoluto o altri fattori tecnici.',
  1
),
(
  (SELECT id FROM lessons WHERE slug = 'volatilita-crypto'),
  'Alta volatilità significa sempre perdite',
  'true_false',
  '[
    {"text": "Vero", "is_correct": false},
    {"text": "Falso", "is_correct": true}
  ]'::jsonb,
  'Alta volatilità significa rischio in entrambe le direzioni: può portare sia guadagni che perdite rapide.',
  2
),
-- Market Cap Quiz
(
  (SELECT id FROM lessons WHERE slug = 'market-cap-prezzo'),
  'Come si calcola il market cap?',
  'multiple_choice',
  '[
    {"text": "Prezzo × numero di monete in circolazione", "is_correct": true},
    {"text": "Prezzo × numero di transazioni", "is_correct": false},
    {"text": "Solo il prezzo della singola moneta", "is_correct": false},
    {"text": "Volume di trading giornaliero", "is_correct": false}
  ]'::jsonb,
  'Market cap = prezzo unitario × supply totale. Questo indica il valore complessivo del progetto.',
  1
),
-- FOMO Quiz
(
  (SELECT id FROM lessons WHERE slug = 'fomo-hype-cicli'),
  'Quando è il momento migliore per comprare secondo la lezione?',
  'multiple_choice',
  '[
    {"text": "Quando tutti ne parlano sui social", "is_correct": false},
    {"text": "Quando il prezzo sta salendo rapidamente", "is_correct": false},
    {"text": "Quando nessuno ne parla ancora", "is_correct": true},
    {"text": "Quando gli influencer lo consigliano", "is_correct": false}
  ]'::jsonb,
  'L''hype di massa di solito coincide con i picchi. I momenti migliori sono spesso quando c''è meno attenzione mediatica.',
  1
),
-- Pump & Dump Quiz
(
  (SELECT id FROM lessons WHERE slug = 'pump-dump-schema'),
  'Cosa caratterizza uno schema Pump & Dump?',
  'multiple_choice',
  '[
    {"text": "Crescita organica e graduale", "is_correct": false},
    {"text": "Hype coordinato seguito da vendite massive", "is_correct": true},
    {"text": "Analisi tecnica approfondita", "is_correct": false},
    {"text": "Investimenti istituzionali", "is_correct": false}
  ]'::jsonb,
  'Il Pump & Dump si basa su coordinazione artificiale per gonfiare il prezzo, seguita da vendite che fanno crollare tutto.',
  1
);

-- Comments
COMMENT ON TABLE lesson_categories IS 'Categories for organizing microlearning lessons';
COMMENT ON TABLE lessons IS 'Individual microlearning lessons with Tradelia methodology structure';
COMMENT ON TABLE quiz_questions IS 'Quiz questions for each lesson to test comprehension';
COMMENT ON TABLE user_lesson_progress IS 'Tracks user progress through lessons, supports both authenticated and guest users';
COMMENT ON TABLE quiz_attempts IS 'Records all quiz attempts for analytics and progress tracking';