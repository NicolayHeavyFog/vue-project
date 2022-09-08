import { navigateTabs } from '@/animation/productPage';
import { ref } from 'vue';

export default function tabsSwiper() {
  const tab = ref('description');
  const lastTab = ref('description');
  const targetDescription = ref(null);
  const targetCharacteristics = ref(null);
  const targetWarranty = ref(null);
  const targetDelivery = ref(null);

  const descriptionObj = {
    header: 'description',
    tab: targetDescription.value,
  };
  const characteristicsObj = {
    header: 'characteristics',
    tab: targetCharacteristics.value,
  };
  const warrantyObj = {
    header: 'warranty',
    tab: targetWarranty.value,
  };
  const deliveryObj = {
    header: 'delivery',
    tab: targetDelivery.value,
  };

  function calculateTab() {
    let directionRight = true;
    let resultSequenceElement = [];
    descriptionObj.tab = targetDescription.value;
    characteristicsObj.tab = targetCharacteristics.value;
    warrantyObj.tab = targetWarranty.value;
    deliveryObj.tab = targetDelivery.value;

    const mapTab = [descriptionObj, characteristicsObj, warrantyObj, deliveryObj];
    const indexCurrentTab = mapTab.findIndex((currentTab) => currentTab.header === tab.value);
    const indexLastTab = mapTab.findIndex((currentTab) => currentTab.header === lastTab.value);
    const activeTabElement = mapTab.find((t) => t.header === tab.value);

    if (indexCurrentTab > indexLastTab) resultSequenceElement = mapTab.slice(Math.min(indexCurrentTab, indexLastTab), Math.max(indexCurrentTab, indexLastTab));
    if (indexLastTab > indexCurrentTab) {
      for (let i = indexLastTab; i > indexCurrentTab; i--) {
        resultSequenceElement.push(mapTab[i]);
        directionRight = false;
      }
    }

    if (lastTab.value !== tab.value) {
      navigateTabs(resultSequenceElement, activeTabElement.tab, directionRight);
      lastTab.value = tab.value;
    }
  }

  return {
    tab,
    lastTab,
    targetDescription,
    targetCharacteristics,
    targetWarranty,
    targetDelivery,
    calculateTab,
  };
}
