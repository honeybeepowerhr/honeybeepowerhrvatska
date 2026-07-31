import Stripe from 'stripe'

export interface PaymentIntentMetadata {
  [key: string]: string
}

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  metadata?: PaymentIntentMetadata
  description?: string
}

export interface PaymentIntent {
  id: string
  client_secret: string | null
  amount: number
  currency: string
  status: string
  metadata: PaymentIntentMetadata
}

export interface StripeClient {
  paymentIntents: {
    create: (params: CreatePaymentIntentParams) => Promise<PaymentIntent>
  }
}

function createMockStripe(): StripeClient {
  return {
    paymentIntents: {
      create: async (params: CreatePaymentIntentParams): Promise<PaymentIntent> => {
        await new Promise((resolve) => setTimeout(resolve, 10))

        const id = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
        const clientSecret = `${id}_secret_mock${Math.random().toString(36).slice(2, 18)}`

        return {
          id,
          client_secret: clientSecret,
          amount: params.amount,
          currency: params.currency,
          status: 'requires_payment_method',
          metadata: params.metadata ?? {},
        }
      },
    },
  }
}

function createStripeClient(): StripeClient {
  const key = process.env.STRIPE_SECRET_KEY ?? ''

  if (!key) {
    console.warn('[stripe/client] STRIPE_SECRET_KEY is not set — using mock Stripe client.')
    return createMockStripe()
  }

  return new Stripe(key) as unknown as StripeClient
}

export const stripe: StripeClient = createStripeClient()
