import { sdk } from '../../lib/medusa';
import { transformedProducts } from '../../utils';

const getSignatureProducts = async () => {
  try {
    const { products } = await sdk.store.product.list({
      fields:
        '+metadata,+variants.inventory_quantity,*variants.calculated_price',
    });import { sdk } from '../../lib/medusa';
import { transformedProducts } from '../../utils';

const getSignatureProducts = async () => {
  try {
    const { products } = await sdk.store.product.list({
      fields:
        '+metadata,+variants.inventory_quantity,*variants.calculated_price',
    });
    const signatureProducts = products.filter(
      (product) => product.metadata && product.metadata.signature_dish === true
    );
    return transformedProducts(signatureProducts);
  } catch (error) {
