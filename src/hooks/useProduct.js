import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import {
  ref, computed, reactive,
} from 'vue';

export default function () {
  const productData = ref(null);
  const category = computed(() => productData.value.category);
  // const offers = computed(() => {
  //   if (product) {
  //     console.log(product);
  //     return product.value.offers;
  //   }
  //   return [];
  // });
  const fetchStatus = reactive({
    isLoading: true,
    isFailed: false,
  });

  const fetchProduct = (productId) => {
    fetchStatus.isLoading = true;
    fetchStatus.isFailed = false;

    axios.get(`${API_BASE_URL}/api/products/${productId}`)
      .then((response) => {
        const product = response.data;
        productData.value = {
          pricePretty: numberFormat(product.price),
          price: product.price,
          colors: product.colors,
          specifications: product.specifications,
          image: product.preview.file.url,
          mainProp: product.mainProp.code,
          offers: product.offers,
          productId: product.id,
          title: product.title,
          category: product.category,
        };
      })
      .catch(() => { fetchStatus.isFailed = true; })
      .then(() => {
        fetchStatus.isLoading = false;
      });
  };

  return {
    product: productData,
    category,
    fetchProduct,
    status: fetchStatus,
  };
}
