"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { UserPlus, CheckCircle, XCircle, Building2, Mail, Shield } from 'lucide-react';
import { useToast } from '@/components/UI/Toast';
import { useAsyncAction } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import Logo from '@/components/app/logo';
import { useRouter, useSearchParams } from 'next/navigation';

interface InvitationDetails {
  organizationName: string;
  inviterEmail: string;
  role: string;
  email: string;
  isRegistered: boolean;
}

export default function AcceptInvitation() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [invitationStatus, setInvitationStatus] = useState<'loading' | 'valid' | 'invalid' | 'accepted' | 'error'>('loading');
  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { showSuccess, showError } = useToast();
  const { execute: acceptInvitation, loading: accepting } = useAsyncAction(
    () => apiService.acceptInvitation(token)
  );
  const router = useRouter();

  useEffect(() => {
    validateToken();
  }, [token]);

  const extractInvitationData = (): InvitationDetails | null => {
    try {
      const email = searchParams.get('email');
      const organization = searchParams.get('organization');
      const role = searchParams.get('role');
      const invitedby = searchParams.get('invitedby');
      const isRegistered = searchParams.get('isRegistered') === 'true';

      if (!email || !organization || !role || !invitedby) {
        throw new Error('Missing required invitation parameters');
      }

      return {
        organizationName: decodeURIComponent(organization),
        inviterEmail: decodeURIComponent(invitedby),
        role: decodeURIComponent(role),
        email: decodeURIComponent(email),
        isRegistered
      };
    } catch (error) {
      return null;
    }
  };

  const validateToken = async () => {
    if (!token) {
      setInvitationStatus('invalid');
      setErrorMessage('No invitation token provided');
      return;
    }

    if (token.length < 32) {
      setInvitationStatus('invalid');
      setErrorMessage('Invalid invitation token format');
      return;
    }

    try {
      const details = extractInvitationData();
      
      if (!details) {
        setInvitationStatus('invalid');
        setErrorMessage('Invalid invitation link - missing required parameters');
        return;
      }

      // Optional: Validate token with backend
      // const response = await apiService.validateInvitationToken(token);
      // if (!response.valid) {
      //   setInvitationStatus('invalid');
      //   setErrorMessage(response.error || 'Token validation failed');
      //   return;
      // }

      setInvitationDetails(details);
      setInvitationStatus('valid');
    } catch (error) {
      setInvitationStatus('invalid');
      setErrorMessage('Failed to validate invitation');
      console.error('Invitation validation error:', error);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      const result = await acceptInvitation();
      if (result !== null) {
        setInvitationStatus('accepted');
        showSuccess('Invitation Accepted', 'You have successfully joined the organization!');
      } else {
        setInvitationStatus('error');
        setErrorMessage('Failed to accept invitation. Please try again.');
        showError('Error', 'Failed to accept invitation');
      }
    } catch (error) {
      setInvitationStatus('error');
      setErrorMessage('An unexpected error occurred while accepting the invitation');
      showError('Error', 'Failed to accept invitation');
      console.error('Accept invitation error:', error);
    }
  };

  const renderContent = () => {
    switch (invitationStatus) {
      case 'loading':
        return (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Validating invitation...</p>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'This invitation link is invalid or has expired.'}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Common reasons:</strong>
              </p>
              <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                <li>The invitation link has expired</li>
                <li>The invitation has already been accepted</li>
                <li>The invitation was cancelled by the administrator</li>
                <li>The link is malformed or incomplete</li>
              </ul>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => router.replace('/login')}
                variant="secondary"
              >
                Go to Login
              </Button>
            </div>
          </div>
        );

      case 'accepted':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully joined <strong>{invitationDetails?.organizationName}</strong>. 
              You can now access the organization&apos;s invoice management system.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                <strong>What&apos;s next?</strong>
              </p>
              <ul className="text-sm text-green-600 mt-2 list-disc list-inside">
                <li>You will be redirected to the main application</li>
                <li>Your role has been set to: <strong>{invitationDetails?.role}</strong></li>
                <li>You can start managing invoices and clients</li>
              </ul>
            </div>
            <Button onClick={() => router.replace('/app')} variant="primary">
              Continue to Application
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Accepting Invitation</h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || 'There was an error processing your invitation. Please try again or contact support.'}
            </p>
            <div className="flex space-x-3">
              <Button onClick={handleAcceptInvitation} variant="primary">
                Try Again
              </Button>
              <Button onClick={() => router.replace('/login')} variant="secondary">
                Go to Login
              </Button>
            </div>
          </div>
        );

      case 'valid':
      default:
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Invited!</h2>
              <p className="text-gray-600">
                You have been invited to join an organization on Nexcom Invoice
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Organization</p>
                  <p className="text-gray-900">{invitationDetails?.organizationName}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Invited by</p>
                  <p className="text-gray-900">{invitationDetails?.inviterEmail}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Your Email</p>
                  <p className="text-gray-900">{invitationDetails?.email}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Your Role</p>
                  <p className="text-gray-900">{invitationDetails?.role}</p>
                </div>
              </div>

              {invitationDetails?.isRegistered === false && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You will need to complete your account registration after accepting this invitation.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What you&apo;ll get access to:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create and manage invoices</li>
                <li>• Manage clients and items</li>
                <li>• View organization reports</li>
                <li>• Collaborate with team members</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleAcceptInvitation}
                loading={accepting}
                className="flex-1"
              >
                Accept Invitation
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.close()}
                className="flex-1"
              >
                Decline
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By accepting this invitation, you agree to join the organization and follow their policies.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center">
              <Logo className="w-20 h-20 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900"></h1>
          </div>
        </div>

        <Card>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
}