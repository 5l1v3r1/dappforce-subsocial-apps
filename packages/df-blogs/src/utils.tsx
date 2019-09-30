import React, { useState, useEffect } from 'react';
import { Pagination as SuiPagination } from 'semantic-ui-react';

import { AccountId, AccountIndex, Address, Option } from '@polkadot/types';
import AddressMini from '@polkadot/ui-app/AddressMiniDf';
import { SubmittableResult } from '@polkadot/api';
import { CommentId, PostId, BlogId, Profile, ProfileData } from './types';
import { OuterProps as PropsWithEditProfile } from './EditProfile';
import { getJsonFromIpfs } from './OffchainUtils';
import { SocialAccount } from '@dappforce/types/blogs';
import BN from 'bn.js';

type AuthorPreviewProps = {
  address: AccountId | AccountIndex | Address | string
};

// TODO show member instead of address.
export function AuthorPreview ({ address }: AuthorPreviewProps) {
  return (
    <AddressMini value={address} isShort={false} isPadded={false} withBalance={true} withName={true} size={36} />
  );
}

type PaginationProps = {
  currentPage?: number,
  totalItems: number,
  itemsPerPage?: number,
  onPageChange: (activePage?: string | number) => void
};

export const Pagination = (p: PaginationProps) => {
  const { currentPage = 1, itemsPerPage = 20 } = p;
  const totalPages = Math.floor(p.totalItems / itemsPerPage);

  return totalPages <= 1 ? null : (
    <SuiPagination
      firstItem={null}
      lastItem={null}
      defaultActivePage={currentPage}
      totalPages={totalPages}
      onPageChange={(_event, { activePage }) => p.onPageChange(activePage)}
    />
  );
};

export function getNewIdFromEvent<IdType extends BlogId | PostId | CommentId | AccountId>
  (_txResult: SubmittableResult): IdType | undefined {

  let id: IdType | undefined;

  _txResult.events.find(event => {
    const { event: { data, method } } = event;
    if (method.indexOf('ProfileCreated') >= 0) {
      const [ newId ] = data.toArray();
      id = newId as IdType;
      return true;
    } else if (method.indexOf(`Created`) >= 0) {
      const [/* owner */, newId ] = data.toArray();
      id = newId as IdType;
      return true;
    }
    return false;
  });

  return id;
}

export type UrlHasIdProps = {
  match: {
    params: {
      id: string
    }
  }
};

export type UrlHasAddressProps = {
  match: {
    params: {
      address: string
    }
  }
};

export function withIdFromMyAddress (Component: React.ComponentType<PropsWithEditProfile>) {
  return function (props: UrlHasAddressProps) {
    const { match: { params: { address } } } = props;
    try {
      return <Component id={new AccountId(address)} {...props}/>;
    } catch (err) {
      return <em>Invalid address: {address}</em>;
    }
  };
}

type PropsWithSocialAccount = {
  profile?: Profile,
  profileData?: ProfileData,
  socialAccount?: SocialAccount,
  requireProfile?: boolean
};

type LoadSocialAccount = PropsWithSocialAccount & {
  socialAccountOpt?: Option<SocialAccount>
};

export function withSocialAccount<P extends LoadSocialAccount> (Component: React.ComponentType<P>) {
  return function (props: P) {
    const { socialAccountOpt, requireProfile = false } = props;

    if (socialAccountOpt === undefined) return <em>Loading...</em>;
    else if (socialAccountOpt.isNone && requireProfile) return <em>Social account not found yet.</em>;
    else if (socialAccountOpt.isNone) return <Component {...props} />;

    const socialAccount = socialAccountOpt.unwrap();
    const profileOpt = socialAccount.profile;

    if (profileOpt.isNone) return <em>Profile is not created yet.</em>;

    const profile = profileOpt.unwrap() as Profile;

    const ipfsHash = profile.ipfs_hash;
    const [ profileData , setProfileData ] = useState({} as ProfileData);

    useEffect(() => {
      if (!ipfsHash) return;
      getJsonFromIpfs<ProfileData>(ipfsHash).then(json => {
        setProfileData(json);
      }).catch(err => console.log(err));
    }, [ false ]);

    return <Component {...props} socialAccount={socialAccount} profile={profile} profileData={profileData}/>;
  };
}

export function withRequireProfile<P extends LoadSocialAccount> (Component: React.ComponentType<P>) {
  return function (props: P) {
    return <Component {...props} requireProfile/>;
  };
}

export function pluralizeText (count: number | BN, singularText: string, pluralText?: string) {
  count = typeof count !== 'number' ? count.toNumber() : count;
  const plural = () => !pluralText ? singularText + 's' : pluralText;
  const text = count === 1 ? singularText : plural();
  return <><b>{count}</b> {text}</>;
}
