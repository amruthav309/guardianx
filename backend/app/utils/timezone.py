from datetime import datetime, timezone, timedelta

# IST Timezone (UTC + 5:30)
IST = timezone(timedelta(hours=5, minutes=30))

def get_ist_now():
    """Return current naive datetime in Indian Standard Time (IST)."""
    return datetime.now(IST).replace(tzinfo=None)

def get_ist_str():
    """Return formatted IST time string."""
    return datetime.now(IST).strftime("%d-%m-%Y %I:%M:%S %p IST")
