import { Stripe } from 'stripe';
import { User } from '../models/user.entity';

export class StripeService {
  private config: Stripe.StripeConfig = null;
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SK, this.config);
  }

  // todo
  // Kun tilaus loppuu, poista stripeCustomer tai jotain

  async createCheckoutSession(
    user: User,
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
  ): Promise<Stripe.Checkout.Session> {
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.STRIPE_CALLBACK_URL}?session={CHECKOUT_SESSION_ID}&email=${user.email}`,
      cancel_url: process.env.FRONTEND_URL,
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 30 },
      automatic_tax: {
        enabled: false
      }
    };

    if (user.stripeCustomer) {
      params.customer = user.stripeCustomer;
    } else {
      params.customer_email = user.email;
    }

    return this.stripe.checkout.sessions.create(params);
  }

  async getCheckoutSessionId(user: User) {
    const items = [
      {
        price: process.env.PRICE,
        quantity: 1
      }
    ];

    const { id } = await this.createCheckoutSession(user, items);
    return { id };
  }

  async getUpdateSession(user: User) {
    return await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomer,
      return_url: process.env.FRONTEND_URL
    });
  }

  async getSession(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async getCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  async getSubscriptions(customerId: string) {
    return this.stripe.subscriptions.list({ customer: customerId });
  }

  async updateSubscription(subscription: Stripe.Subscription) {
    return this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: subscription.cancel_at_period_end
    });
  }

  async hasSubscription(user: User): Promise<boolean> {
    if (!user?.stripeCustomer) {
      return false;
    }

    const subscriptions = await this.getSubscriptions(user.stripeCustomer);
    return subscriptions.data.length > 0;
  }
}
