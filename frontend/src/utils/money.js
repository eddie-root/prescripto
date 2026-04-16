
export function formatCurrency(valueInCents){
    if (valueInCents === undefined) {
        return (0).toFixed(2);
    } else {
        // return (priceCents).toFixed(2);
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format((valueInCents/100).toFixed(2));
    }
}

export default formatCurrency;