import base64
from django.views.decorators.csrf import csrf_exempt
import json
from login.models import User
from map.models import Like, Event, Comment
from map.views import get_profilebase64, format_event
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.


def index(request):
    return render(request, 'board/board_base.html')

# login: 1; else: 0


def is_login(request):
    is_login = request.session.get('is_login', None)
    if request.is_ajax() and is_login:
        response = json.dumps({'login': 1})
    else:
        response = json.dumps({'login': 0})
    return HttpResponse(response)


@csrf_exempt
def user_basic(request):
    is_login = request.session.get('is_login', None)
    if request.is_ajax() and is_login:
        user_id = request.session.get('user_id')
        user = User.objects.get(pk=user_id)
        profile = user.profile
        response = json.dumps({
            'status': 0,
            'profilebase64': get_profilebase64(profile),
            'user_id': user.id,
            'username': user.username
        })
    else:
        response = json.dumps({'status': 1})
    return HttpResponse(response)


def user_event_interactive(request, func, db):
    response = {}
    is_login = request.session.get('is_login', None)
    if request.is_ajax() and is_login and request.method == 'POST':
        data = json.loads(request.body)
        data['user_id'] = request.session.get('user_id')
        response['status'] = '0'
    else:
        response['status'] = '1'
        if not is_login:
            response['error'] = '用户未登录'
        response = json.dumps(response)
        return HttpResponse(response)

    # If request valid, like the event
    try:
        func(db, data, response)
    except:
        response['status'] = '0'

    response = json.dumps(response)
    return HttpResponse(response)

# On event liking request, like the event.
#
# Required:
#     request: {'event', 'user'}


@csrf_exempt
def like(request):
    return user_event_interactive(request, like_event, Like)


# Create model obj with foreign key: https://stackoverflow.com/questions/4195242/django-model-object-with-foreign-key-creation

# Unlike or like an event
def like_event(db, data, reponse):
    like = data.get('like')
    event_id = data.get('event_id')
    user_id = data.get('user_id')
    if like == 1:
        # If already liked, quit.
        if (Like.objects.filter(event__id=event_id, user__id=user_id)): 
            return
        new_like = db(
            event_id=event_id,
            user_id=user_id,
        )
        new_like.save()
    elif like == 0:
        db.objects.filter(event__id=event_id, user__id=user_id).delete()
    else:
        raise ValueError("Flag value invalid.")


# On event commenting request.
#
# Required:
#     request: {'event', 'user', 'comment'}


@csrf_exempt
def comment(request):
    return user_event_interactive(request, comment_event, Comment)


def comment_event(db, data, response):
    event_id = data.get('event_id')
    user_id = data.get('user_id')
    comment = data.get('comment')
    new_comment = db(
        event_id=event_id,
        user_id=user_id,
        comment=comment
    )
    new_comment.save()


# On event repost request.
#
# Required:
#     request: {'event', 'user', 'comment'}


@csrf_exempt
def repost(request):
    return user_event_interactive(request, repost_event, Event)


def repost_event(db, data, response):
    event_id = data.get('event_id')
    owner_id = Event.objects.get(pk=event_id).owner.id
    # owner_id = data.get('event_owner_id')
    user_id = data.get('user_id')

    # check self repost
    if owner_id == user_id:
        response['status'] = 1
        response['error'] = 'Repost self is invalid.'
        return

    # check repost a repost (it should point to its parent event)
    if db.objects.get(pk=event_id).repost is not None:
        response['status'] = 1
        response['error'] = 'Repost a repost is invalid.'
        return

    repostcomment = data.get('comment')

    # lat, lng are db_index! must be given!
    new_repost = db(
        name='repost',
        repost_id=event_id,
        owner_id=user_id,
        repostcomment=repostcomment,
        lat=0.,
        lng=0.
    )

    new_repost.save()



@csrf_exempt
def category(request):
    response = {}
    is_login = request.session.get('is_login', None)
    if request.is_ajax() and is_login:
        if request.method == 'POST':
            data = json.loads(request.body)
            option = data.get('option')
            response['status'] = 0
    else: 
        response['status'] = 1
        response = json.dumps(response)
        return HttpResponse(response)
    
    user_id = request.session.get('user_id', None)
    # depend on option, find corresponding events
    if option == "自己":
        events = Event.objects.filter(owner__id = user_id)
        print(events)
    # elif option == "朋友":
    #     friends = User
    # elif option == "热点":
    else: 
        raise ValueError("Option is invalid: "+option)


    # Format events. Send JSON. 
    # If empty events, return an empty json array.
    response = [format_event(event, user_id) for event in events]
    response = json.dumps(response)

    return HttpResponse(response)
