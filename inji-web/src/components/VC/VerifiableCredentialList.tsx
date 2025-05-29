import {WalletCredential} from "../../types/data";
import {VCCardView} from "./VCCardView";
import {NoCredentialsStored} from "./NoCredentialsStored";

type VerifiableCredentialsListProps = {
    walletCredentials: WalletCredential[],
    viewCredential: (credential: WalletCredential) => void
};

export function VerifiableCredentialsList({
                                              walletCredentials,
                                              viewCredential
                                          }: Readonly<VerifiableCredentialsListProps>) {

    if (!walletCredentials || walletCredentials.length === 0) {
        return <NoCredentialsStored/>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
        {walletCredentials.map((credential) => (
          <VCCardView
            key={credential.credentialId}
            onClick={viewCredential}
            credential={credential}
          />
        ))}
      </div>
    );
}