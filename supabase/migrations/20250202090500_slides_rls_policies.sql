-- Enable RLS on tables
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_slides ENABLE ROW LEVEL SECURITY;

-- Policy for user_slides table
CREATE POLICY "Users can manage their slides" ON public.user_slides
AS PERMISSIVE FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for slides table
CREATE POLICY "Users can access their slides" ON public.slides
AS PERMISSIVE FOR SELECT
USING (EXISTS (
  SELECT 1
  FROM public.user_slides
  WHERE user_slides.slide_id = slides.id
  AND user_slides.user_id = auth.uid()
));

CREATE POLICY "Users can insert slides" ON public.slides
AS PERMISSIVE FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their slides" ON public.slides
AS PERMISSIVE FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM public.user_slides
  WHERE user_slides.slide_id = slides.id
  AND user_slides.user_id = auth.uid()
))
WITH CHECK (true);
