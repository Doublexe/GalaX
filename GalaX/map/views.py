import sys
import os

from django.shortcuts import render
from django.http import HttpResponse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.utils import IntegrityError

from map.models import Event, Like, Comment
import json
from django.views.decorators.csrf import csrf_exempt
import base64


# Create your views here.

def index(request):
    return render(request, 'map/map_base.html')


def to_event(request, id):
    event = Event.objects.get(pk=id)
    


# On document ready, get the nearby events.
#
# Required:
#     request: {'this_position'}
@csrf_exempt
def nearby(request):
    # Get location. 
    if request.is_ajax():
        if request.method == 'POST':
            position = json.loads(request.body).get('this_position')
    else: 
        position = {'lng':104.0668,'lat':30.5728} # Default: TODO: this is chengdu position
    
    # Get nearby events.
    lng, lat = position['lng'], position['lat']
    low_lng, high_lng, low_lat, high_lat = get_position_range(lng, lat)
    nearbys = get_nearby_events(Event, low_lng, high_lng, low_lat, high_lat)
    
    # Format nearby events. Send JSON. 
    # If empty nearbys, return an empty json array.
    user_id = request.session.get('user_id', None)
    response = [format_event(nearby, user_id) for nearby in nearbys]
    response = json.dumps(response)

    return HttpResponse(response)

# On event adding request, add the event.
#
# Required:
#     request: {'event'}
#     large request maximum size:
#       https://stackoverflow.com/questions/41408359/requestdatatoobig-request-body-exceeded-settings-data-upload-max-memory-size
@csrf_exempt
def upload(request):
    response = {}
    is_login = request.session.get('is_login', None)
    if request.is_ajax() and is_login:
        if request.method == 'POST':
            event = json.loads(request.body).get('event')
            response['status'] = '0'
    else: 
        response['status'] = '1'
        response = json.dumps(response)
        return HttpResponse(response)
    
    # If request valid, add the event
    user_id = request.session.get('user_id', None)
    try:
        add_event(Event, event, user_id)
    except IntegrityError:
        response['status'] = '1'

    response = json.dumps(response)
    return HttpResponse(response)
    

# Compute a range for "nearby" events. TODO: range
RANGE = 0.1  # Approximately half of a central city.
RADIUS = RANGE / 2
def get_position_range(lng, lat):
    return lng - RADIUS, lng + RADIUS, lat - RADIUS, lat + RADIUS


# Given an event object and current user, return the dict format (ready for JSON)
# TODO: repost
def format_event(event, user_id):
    owner = event.owner
    profile = owner.profile
    liked, num_likes = is_like_event(event, user_id)

    mode = is_repost(event)
    
    if mode == 'repost':
        repost = event
        event = repost.repost
        reposter = repost.owner
        owner = event.owner
        profile = reposter.profile

        profilebase64 = get_profilebase64(profile)

        return \
        {
            'id': str(repost.id),
            'type': get_icon_type(reposter.id, user_id), # icon_type
            'likes': num_likes,
            'liked': liked,
            'mode': mode, # if is repost
            'repost_comment': 
                [{
                    'commentername': owner.username,
                    'commenter_id': owner.id,
                    'commenter_comment': repost.repostcomment,
                    'commenter_profilebase64': get_profilebase64(owner.profile)
                }],
            'comments': get_comments(repost),
            'ownername': owner.username,
            'owner_id': owner.id,
            'repostername': reposter.username,
            'reposter_id': reposter.id,
            'repost_from': format_event(event, user_id),
            'reposter_profilebase64': profilebase64
        }

    elif mode == 'normal':

        profilebase64 = get_profilebase64(profile)

        return \
        {
            'id': str(event.id),
            'type': get_icon_type(owner.id, user_id), # icon_type
            'lng': str(event.lng),  # json needs utf-8
            'lat': str(event.lat),  
            'summary': event.summary,
            'content': event.content,
            'name': event.name,
            'likes': num_likes,
            'liked': liked,
            'mode': mode, # if is repost
            # base64: https://stackoverflow.com/questions/3715493/encoding-an-image-file-with-base64
            'imagebase64': base64.b64encode(event.image.read()).decode('utf-8'),  # json needs utf-8
            'profilebase64': profilebase64,
            'ownername': owner.username,
            'owner_id': owner.id,
            'comments': get_comments(event)
        }
    else:
        raise ValueError("Mode of the event invalid.")


# Get is_liked_by_this_user, number of likes
def is_like_event(event, user_id):
    num_likes = Like.objects.filter(event__id = event.id).count()
    liked_by_this_user_query = Like.objects.filter(event__id = event.id, user__id = user_id)
    if not liked_by_this_user_query:
        liked = False
    else:
        liked = True
    return liked, num_likes

def get_icon_type(owner_id, user_id):
    if owner_id == user_id:
        type_ = 'self'
    else:
        type_ = 'none'
    return type_

def is_repost(event):
    if not event.repost:
        return 'normal'
    else:
        return 'repost'


# Given a range and DB, return the nearby events
def get_nearby_events(db, low_lng, high_lng, low_lat, high_lat):
    # Get nearby
    return \
    db.objects \
    .filter(lng__range=(low_lng, high_lng)) \
    .filter(lat__range=(low_lat, high_lat))


def add_event(db,event,user_id):
    image_type = event['imagebase64_and_type']['type']
    new_event = db(
        name = event['name'],
        image = SimpleUploadedFile(
            name=event['name']+'.'+image_type,
            content=base64.b64decode(event['imagebase64_and_type']['imagebase64']), 
            content_type='image/'+image_type),
        summary = event['summary'],
        content = event['content'],
        lng = event['lng'],
        lat = event['lat'],
        owner_id = user_id
    )
    new_event.save()


# If profile has avatar, return base64. Else return null.
def get_profilebase64(profile):
    try:
        return base64.b64encode(profile.avatar.read()).decode('utf-8')
    except:
        return ''


# Given the event obj, get and format the comments.
def get_comments(event):
    comments = Comment.objects.filter(event__id = event.id)
    formatted = []
    for comment in comments:
        commenter = comment.user
        formatted.append(
            {
                'commentername': commenter.username,
                'commenter_id': commenter.id,
                'commenter_comment': comment.comment,
                'commenter_profilebase64': get_profilebase64(commenter.profile)
            }
        )
    return formatted