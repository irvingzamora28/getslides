CREATE TABLE public.slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme JSONB
);

CREATE TABLE public.user_slides (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slide_id UUID REFERENCES public.slides(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, slide_id)
);

CREATE INDEX idx_user_slides_user ON public.user_slides(user_id);
CREATE INDEX idx_user_slides_slide ON public.user_slides(slide_id);

ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_slides ENABLE ROW LEVEL SECURITY;
