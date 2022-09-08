<template>
<div>
  <BaseLoader v-if="productStatus.isLoading"/>
  <div v-else-if="productStatus.isFailed">
    <div class="">Произошла ошибка... <button @click.prevent="loadProducts">Перезагрузить</button> </div>
  </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="product.image" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.id}}</span>
        <h2 class="item__title">
          {{product.title}}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="doAddToCart(product.id)">
            <b class="item__price">
              {{ product.pricePretty }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item"
                 v-for='currentColor in colorsPull'
                 :key ='product.id * currentColor.id'>
                  <label class="colors__label">
                    <input class="colors__radio sr-only" type="radio" name="color-item"
                    :value="currentColor.id"
                    :checked="currentColor.id === chosenColor"
                    >
                    <span class="colors__value" :style="doStyle(currentColor.code)">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">Объемб в ГБ:</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="32">
                    <span class="sizes__value">
                      32gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="64">
                    <span class="sizes__value">
                      64gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="128" checked="">
                    <span class="sizes__value">
                      128gb
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click="productAmount--">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар" @click="productAmount++">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery" type="submit"
              :disabled="addingStatus.productAddSending">
                В корзину
              </button>

              <BaseModal v-model:open="isShowAddedMessage">
                Товар добавлен в корзину
              </BaseModal>

            </div>

            <div v-show='addingStatus.added'>Товар добавлен в корзину</div>
            <div v-show='addingStatus.productAddSending'>Проиходит отправка этого товара в корзину</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
            Синхронизация со смартфоном<br>
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
            Поддержка сторонних приложений<br>
          </p>

          <a href="#">
            Все характеристики
          </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет оптимизировать свои велотренировки, сделав их максимально эффективными.
            Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по ANT+, объединяя полученную с них информацию.
            Данные отображаются на дисплее, а также сохраняются на смартфоне. При этом на мобильное устройство можно установить как фирменное приложение, так и различные приложения сторонних разработчиков.
             Велокомпьютер точно отслеживает местоположение, принимая сигнал с целого комплекса спутников. Эта информация позволяет смотреть уже преодоленные маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства составляют всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты смартфона.
             Корпус гаджета выполнен из черного пластика. На обращенной к пользователю стороне расположен дисплей диагональю 56 мм.
             На дисплей выводятся координаты и скорость, а также полученная со смартфона и синхронизированных датчиков информация: интенсивность, скорость вращения педалей, пульс и т.д.
             (датчики не входят в комплект поставки). Корпус велокомпьютера имеет степень защиты от влаги IPX7. Это означает, что устройство не боится пыли,
              а также выдерживает кратковременное (до 30 минут) погружение в воду на глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
import BaseModal from '@/components/BaseModal.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import { defineComponent } from 'vue';
// import { useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';
import useAddProduct from '@/hooks/useAddProduct';

export default defineComponent({
  props: {
    productId: {
      type: [Number, String],
      required: true,
    },
  },
  components: { BaseModal, BaseLoader },
  setup(props) {
    const {
      product, colorsPull, fetchProduct, status: productStatus,
    } = useProduct();

    const {
      doAddToCart, isShowAddedMessage, status: addingStatus, productAmount,
    } = useAddProduct();

    fetchProduct(props.productId);

    const doStyle = (code) => `background-color: ${code};`;

    return {
      // refs
      productAmount,
      // color,
      productData: product,
      productStatus,
      addingStatus,

      // computed
      product,
      colorsPull,
      // chosenColor,

      // Boolean
      isShowAddedMessage,

      // methods
      doAddToCart,
      doStyle,
      // doChooseColor,
    };
  },

});
</script>

<style lang="scss" scoped>
.item {
  grid-template-columns: 1fr;
}
</style>
