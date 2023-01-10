import * as yup from 'yup';
export let RecipeValidationSchema = yup.object().shape({
	
	title: yup.string().required('Please enter title'),
	ingredient: yup.string().required('Please enter Ingredient'),
	description: yup.string().required('Please provide  description')
});

