<script lang="ts">
	import type { RecipeModel } from '/assignment/recipe/webb/src/lib/model';
	import { supabase } from '/assignment/recipe/webb/src/lib/supabaseClient';
	import { RecipeValidationSchema } from '/assignment/recipe/webb/src/lib/validation';
	import { onMount } from 'svelte';
	let recipeList: RecipeModel[] = [];
	let addButton: HTMLButtonElement;
	let closeBtn: HTMLButtonElement;
	let errors: string[] = [];
	let recipeModel: RecipeModel = {
		title: '',
		ingredient: '',
		description: ''
	};
	const loadRecipe = async () => {
		const { data, error } = await supabase.from<RecipeModel>('receipe').select('*');
		if (data && data.length > 0) {
			recipeList = data;
		}
	};

	onMount(async () => {
		await loadRecipe();
	});

	let recipeClick = async (e: any) => {
		e.preventDefault();
		errors = [];

		const recipeRequest = await RecipeValidationSchema.validate(recipeModel, {
			abortEarly: false
		}).catch((err) => {
			errors = err.errors;
		});
		if (!recipeRequest) return;

		const { data, error } = await supabase.from('receipe').upsert(recipeModel);

		recipeModel = {
			title: '',
			ingredient: '',
			description: ''
		};
		closeBtn.click();
		
	};
	let recipeEdit = (recipe: RecipeModel) => {
		addButton.click();
		recipeModel = { ...recipe };
	};
</script>

<div class="container">
	<div class="card m-10">
		<div class="card-body">
			<h5 class="card-title bg-gray-800 p-3">Recipe</h5>
			<button
				type="button"
				class="btn bg-blue-500 float-end"
				data-bs-toggle="modal"
				data-bs-target="#exampleModal"
				bind:this={addButton}
			>
				Add Recipe
			</button>
			<div class="p-3">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">Title</th>
							<th scope="col">Ingredient</th>
							<th scope="col">Description</th>
						</tr>
					</thead>
					<tbody>
						{#each recipeList as receipes}
							<tr>
								<td>{receipes.title}</td>
								<td>{receipes.ingredient}</td>
								<td>{receipes.description}</td>

								<td>
									<button class="btn btn-sm bg-blue-500" on:click={() => recipeEdit(receipes)}
										>Edit</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
<div
	class="modal fade"
	id="exampleModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header bg-pin-300">
				<h5 class="modal-title" id="exampleModalLabel">Save</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<form>
					{#if errors.length > 0}
						<div class="alert alert-primary" role="alert">
							{#each errors as err}
								<p>{err}</p>
							{/each}
						</div>
					{/if}
					<div class="col-md-12">
						<label for="title" class="labels">Title</label>
						<input
							name="txtTitle"
							type="text"
							class="form-control"
							placeholder="Recipe Title"
							bind:value={recipeModel.title}
						/>
					</div>
					<div class="col-md-12">
						<label for="desc" class="labels">Ingredient</label>
						<textarea
							name="desc"
							type="text"
							class="form-control"
							placeholder="Ingredient"
							rows="4"
							bind:value={recipeModel.ingredient}
						/>
					</div>
					<div class="col-md-12">
						<label for="desc" class="labels">Instruction</label>
						<textarea
							name="desc"
							type="text"
							class="form-control"
							placeholder="Instruction"
							rows="4"
							bind:value={recipeModel.description}
						/>
					</div>
				</form>

				<div class="modal-footer bg-yellow-100">
					<button
						type="button"
						bind:this={closeBtn}
						class="btn bg-pink-300"
						data-bs-dismiss="modal">Close</button
					>
					<button type="button" on:click={recipeClick} class="btn bg-pink-300">Save</button>
				</div>
			</div>
		</div>
	</div>
</div>
