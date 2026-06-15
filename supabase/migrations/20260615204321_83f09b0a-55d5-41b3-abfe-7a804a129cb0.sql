UPDATE public.recipes SET hero_image = '/seed/' || slug || '.jpg' WHERE slug IN ('protein-pancakes','egg-white-omelette','high-protein-oatmeal','tandoori-chicken','dal-brown-rice','salmon-veggies','protein-smoothie','peanut-butter-toast','greek-yogurt-parfait');
UPDATE public.programs SET hero_image = '/seed/program-foundations.jpg' WHERE slug='foundations-2wk';
UPDATE public.programs SET hero_image = '/seed/program-strength.jpg' WHERE slug='strength-4wk';
UPDATE public.programs SET hero_image = '/seed/program-shred.jpg' WHERE slug='shred-6wk';