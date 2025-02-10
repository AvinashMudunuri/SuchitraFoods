import { React, useState, useEffect } from 'react';
import { Container, Grid2 as Grid, Typography } from '@mui/material';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import PropTypes from 'prop-types';
import { transformedProducts } from '../utils';
import ErrorBoundary from '../components/ErrorBoundary';
import { useRouter } from 'next/router';
import { sdk } from '../lib/medusa';

export const getServerSideProps = async (context) => {
    const { category_id } = context.query;
    console.log(category_id)
    try {
        const response = await sdk.store.product.list({
            limit: 20,
            category_id: category_id,
            fields:
                '+metadata,+variants.inventory_quantity,*variants.calculated_price',
        });
        console.log(response)
        return {
            props: {
                products: transformedProducts(response.products)
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            props: {
                products: [],
                error: 'Failed to load products',
            },
        };
    }

}


const CategoriesPage = ({ products }) => {
    const viewMode = "grid";
    const router = useRouter();

    if (!products || products.length === 0) {
        return (
            <Container>
                <Typography>No products found.</Typography>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Products | Suchitra Foods</title>
                <meta name="description" content="Suchitra Foods" />
                <meta property="og:title" content="Products | Suchitra Foods" />
                <meta property="og:description" content="Suchitra Foods" />
                <meta
                    property="og:url"
                    content="https://www.suchitrafoods.com/products"
                />
            </Head>
            <Container>
                <Typography variant="h4" sx={{ margin: ".5em 0", textAlign: "center" }}>
                    {category.toUpperCase()}
                </Typography>
                <Grid container spacing={3} sx={{ justifyContent: "center", mb: 2 }}>
                    {products.map((product) => (
                        <Grid
                            item
                            xs={12}
                            sm={viewMode === "grid" ? 6 : 12}
                            md={viewMode === "grid" ? 4 : 12}
                            key={product.id}
                        >
                            <ErrorBoundary fallback={<div>Error loading product</div>}>
                                <ProductCard product={product} />
                            </ErrorBoundary>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

CategoriesPage.propTypes = {
    products: PropTypes.array.isRequired,
};

export default CategoriesPage;
