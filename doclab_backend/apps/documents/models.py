import uuid
from django.conf import settings
from django.db import models

from users.models import User

class DocumentManager(models.Manager):
    def get_user_docs(self, user_id) -> list:
        return list(
            self.filter(
                # owner=User.objects.get_user_by_id(user_id)
            ).all()
        )

    def check_if_doc_exists(self, doc_id):
        return self.filter(id=doc_id).exists()
    
    def get_doc_by_id(self, doc_id):
        return self.filter(id=doc_id).get()


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)
    owner = models.ForeignKey(
        'users.User', 
        related_name='documents', 
        on_delete=models.CASCADE
    )
    collaborators = models.ManyToManyField(
        'users.User', 
        related_name='shared_documents',
        blank=True
    )
    public_link = models.URLField(editable=False)

    objects = DocumentManager()

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if not is_new:
            self.public_link = settings.SITE_URL + str(self.owner.id) +'/document/' + str(self.id)
        super(Document, self).save(update_fields=['public_link'])


class DocumentVersion(models.Model):
    document = models.ForeignKey(
        Document, 
        related_name='versions', 
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
