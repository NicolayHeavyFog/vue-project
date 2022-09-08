import { ref } from 'vue';
import { showImage } from '@/animation/productPage';

export default function useImplementationLoad() {
  const image = ref(null);
  const loader = ref(null);

  function doImplementation() {
    const implementationLoading = new Image();
    implementationLoading.onload = () => {
      loader.value.remove();
      image.value.src = implementationLoading.src;
      showImage(image.value);
    };
    image.value.style.display = 'none';
    implementationLoading.src = image.value.src;
  }

  return {
    image, loader, doImplementation,
  };
}
