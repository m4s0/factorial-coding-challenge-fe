import {Button} from "@mui/material";
import {Link as RouterLink} from "react-router";
import {useAuth} from "../../hooks/useAuth.ts";
import OptionRulePage from "../../pages/OptionRule.tsx";
import OptionPriceRulePage from "../../pages/OptionPriceRule.tsx";

export function AdminMenu() {
    const {logout} = useAuth();

    return <>
        <Button component={RouterLink} to="/admin/category" color="inherit">
            Category
        </Button>
        <Button component={RouterLink} to="/admin/product" color="inherit">
            Product
        </Button>
        <Button component={RouterLink} to="/admin/product-option" color="inherit">
            ProductOptions
        </Button>
        <Button component={RouterLink} to="/admin/product-option-group" color="inherit">
            ProductOptionGroup
        </Button>
        <Button component={RouterLink} to="/admin/option-rule" color="inherit">
            OptionRule
        </Button>
        <Button component={RouterLink} to="/admin/option-price-rule" color="inherit">
            OptionPriceRule
        </Button>
        <Button color="inherit" onClick={logout}>
            Logout
        </Button>
    </>;
}
