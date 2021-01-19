<script lang="typescript">
  import TailwindClassComponent from './TailwindClassComponent.svelte';
  import TailwindScopedComponent from './TailwindScopedComponent.svelte';
  import './TailwindStyles.svelte';

  function handleClick() {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode('.bg-green-500 {background-color:hotpink}'),
    );
    document.getElementsByTagName('head')[0].appendChild(style);
  }
</script>

<div class="flex flex-col space-y-4 m-8 max-w-md mx-auto text-gray-900">
  <h1 class="text-2xl font-bold">Svelte Tailwind Scoped Style Example</h1>
  <p>
    The two buttons below look the same, but one uses scoped styles. If a naming
    conflict occurs, the button that uses scoped styles doesn't get affected.
  </p>
  <TailwindClassComponent />
  <TailwindScopedComponent />
  <button
    class="border-2 border-blue-800 bg-blue-600 text-white rounded-md px-4 py-2 m-2"
    on:click|once={handleClick}>
    Clicking on this adds a `.bg-green-500` class into the document
  </button>
</div>
