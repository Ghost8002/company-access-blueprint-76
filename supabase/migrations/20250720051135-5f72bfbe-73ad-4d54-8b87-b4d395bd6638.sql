
-- Update the user with email "salesdesouzamatheus@gmail.com" to have administrator role
UPDATE public.profiles 
SET role = 'root' 
WHERE email = 'salesdesouzamatheus@gmail.com';

-- Verify the update was successful
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'salesdesouzamatheus@gmail.com';
