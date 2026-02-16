#!/bin/bash
# Swap between Stripe live and test modes
# Usage: ./stripe-mode.sh test    (switch to test keys)
#        ./stripe-mode.sh live    (switch back to live keys)
#        ./stripe-mode.sh status  (show current mode)

cd "$(dirname "$0")"

current_mode() {
  if grep -q "sk_live" .env.local 2>/dev/null; then
    echo "live"
  elif grep -q "sk_test" .env.local 2>/dev/null; then
    echo "test"
  else
    echo "unknown"
  fi
}

case "$1" in
  test)
    if [ ! -f .env.local.test ]; then
      echo "ERROR: .env.local.test not found."
      echo "Create it by copying .env.local and replacing the Stripe keys with test keys."
      echo ""
      echo "You need these from https://dashboard.stripe.com/test/apikeys:"
      echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."
      echo "  STRIPE_SECRET_KEY=sk_test_..."
      exit 1
    fi
    cp .env.local .env.local.live
    cp .env.local.test .env.local
    echo "✓ Switched to Stripe TEST mode"
    echo "  Restart dev server: npm run dev"
    echo "  Test card: 4242 4242 4242 4242 (any future date, any CVC)"
    ;;
  live)
    if [ ! -f .env.local.live ]; then
      echo "ERROR: .env.local.live not found. Cannot restore live keys."
      exit 1
    fi
    cp .env.local.live .env.local
    echo "✓ Switched to Stripe LIVE mode"
    echo "  Restart dev server: npm run dev"
    ;;
  status|"")
    echo "Current Stripe mode: $(current_mode)"
    ;;
  *)
    echo "Usage: ./stripe-mode.sh [test|live|status]"
    ;;
esac
