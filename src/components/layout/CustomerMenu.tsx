import {Badge, Button} from '@mui/material';
import {ShoppingCart} from '@mui/icons-material';
import {useAuth} from "../../hooks/useAuth.ts";
import {Link as RouterLink} from "react-router";

export function CustomerMenu() {
    const {isAuthenticated, logout} = useAuth();

    return (
        <>
            <Button component={RouterLink} to="/" color="inherit">
                Home
            </Button>
            <Button component={RouterLink} to="/products" color="inherit">
                Products
            </Button>
            {isAuthenticated ? (
                <>
                    <Button component={RouterLink} color="inherit">
                        My Orders
                    </Button>
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                    <Button component={RouterLink} to="/cart" color="inherit" sx={{ml: 2}}>
                        {/*<Badge badgeContent={items.length} color="error">*/}
                        <Badge color="error">
                            <ShoppingCart/>
                        </Badge>
                    </Button>
                </>
            ) : (
                <>
                    <Button component={RouterLink} to="/login" color="inherit">
                        Login
                    </Button>
                    <Button component={RouterLink} to="/register" color="inherit">
                        Register
                    </Button>
                </>
            )}
        </>
    );
}
