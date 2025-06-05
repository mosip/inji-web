import { navigateToUserHome } from '../../utils/navigationUtils';
import {ROUTES} from "../../utils/constants";

describe('navigateToUserHome', () => {
    it('should navigate to USER_HOME route', () => {
        const navigateMock = jest.fn();

        navigateToUserHome(navigateMock);

        expect(navigateMock).toHaveBeenCalledWith(ROUTES.USER_HOME);
    });
});